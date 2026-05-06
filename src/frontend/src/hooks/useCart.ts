import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import type { ProductWithQuantity } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";
import { FALLBACK_PRODUCTS } from "./useProducts";

type CartData = {
  items: ProductWithQuantity[];
  subtotal: bigint;
};

// ─── Guest cart (localStorage) ────────────────────────────────────────────────

const GUEST_CART_KEY = "revalife_guest_cart";

type GuestCartItem = { productId: string; quantity: number };

function readGuestCart(): GuestCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? (JSON.parse(raw) as GuestCartItem[]) : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: GuestCartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // ignore storage errors
  }
}

function clearGuestCart() {
  try {
    localStorage.removeItem(GUEST_CART_KEY);
  } catch {
    // ignore
  }
}

function guestCartToCartData(items: GuestCartItem[]): CartData {
  const pwq: ProductWithQuantity[] = items
    .map((item) => {
      const product = FALLBACK_PRODUCTS.find((p) => p.id === item.productId);
      if (!product) return null;
      return {
        product,
        quantity: BigInt(item.quantity),
        price: product.price * BigInt(item.quantity),
      } as ProductWithQuantity;
    })
    .filter((x): x is ProductWithQuantity => x !== null);

  const subtotal = pwq.reduce((acc, i) => acc + i.price, BigInt(0));
  return { items: pwq, subtotal };
}

// ─── Cache helpers ────────────────────────────────────────────────────────────

/** Recalculate subtotal from items array */
function recalcSubtotal(items: ProductWithQuantity[]): bigint {
  return items.reduce(
    (acc, i) => acc + i.product.price * i.quantity,
    BigInt(0),
  );
}

/** Apply an optimistic removal to a CartData snapshot */
function applyOptimisticRemove(prev: CartData, productId: string): CartData {
  const items = prev.items.filter((i) => i.product.id !== productId);
  return { items, subtotal: recalcSubtotal(items) };
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  // ── Guest cart query (local) ──────────────────────────────────────────────
  const guestCartQuery = useQuery<CartData>({
    queryKey: ["guestCart"],
    queryFn: () => guestCartToCartData(readGuestCart()),
    enabled: !isAuthenticated,
    staleTime: 0,
  });

  // ── Backend cart query (when logged in) ───────────────────────────────────
  const backendCartQuery = useQuery<CartData>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCart();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    staleTime: 5_000,
    gcTime: 60_000,
    select: (data) => data,
  });

  // ── Sync guest cart to backend when user logs in ───────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !actor || actorFetching) return;
    const guestItems = readGuestCart();
    if (guestItems.length === 0) return;

    // Fire-and-forget: add each guest item to backend cart
    const sync = async () => {
      for (const item of guestItems) {
        try {
          await actor.addToCart(item.productId, BigInt(item.quantity));
        } catch {
          // ignore individual failures — may already be in cart
        }
      }
      clearGuestCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    };

    sync();
  }, [isAuthenticated, actor, actorFetching, queryClient]);

  // ── Add to cart (guest or backend) ───────────────────────────────────────
  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!isAuthenticated) {
        // Guest path — write to localStorage
        const items = readGuestCart();
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity += Number(quantity);
        } else {
          items.push({ productId, quantity: Number(quantity) });
        }
        writeGuestCart(items);
        return;
      }

      // Authenticated path — must have both actor AND identity
      if (!actor) {
        throw new Error("Actor not ready. Please wait a moment and try again.");
      }

      return actor.addToCart(productId, quantity);
    },
    // Optimistic update for guest cart
    onMutate: async ({ productId, quantity }) => {
      if (!isAuthenticated) {
        await queryClient.cancelQueries({ queryKey: ["guestCart"] });
        const previous = queryClient.getQueryData<CartData>(["guestCart"]);
        return { previous, isGuest: true };
      }
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previous = queryClient.getQueryData<CartData>(["cart"]);
      if (previous) {
        const existing = previous.items.find((i) => i.product.id === productId);
        const updatedItems = existing
          ? previous.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : previous.items;
        queryClient.setQueryData<CartData>(["cart"], {
          ...previous,
          items: updatedItems,
        });
      }
      return { previous, isGuest: false };
    },
    onError: (err, _vars, context) => {
      if (context?.isGuest) {
        if (context.previous) {
          queryClient.setQueryData<CartData>(["guestCart"], context.previous);
        }
      } else {
        if (context?.previous) {
          queryClient.setQueryData<CartData>(["cart"], context.previous);
        }
      }

      if (err instanceof Error && err.message.includes("Actor not ready")) {
        toast.error("Still loading — please try again in a moment.");
        return;
      }

      const message =
        err instanceof Error ? err.message : "Could not add to cart.";

      // Specific error for product-not-found — usually means backend reset
      if (
        message.toLowerCase().includes("product does not") ||
        message.toLowerCase().includes("not found")
      ) {
        toast.error("Product not found — please refresh the page");
        return;
      }

      toast.error(`Add to cart failed: ${message}. Please try again.`);
    },
    onSuccess: (_data, _vars, context) => {
      if (context?.isGuest) {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  // ── Update quantity — simple: fire backend, invalidate on success ──────────
  // No optimistic updates: the QtyControl component already shows localQty
  // instantly, so the user sees responsive UI without cache manipulation.
  // This eliminates the optimistic collision bug where out-of-order responses
  // overwrite the correct quantity in the cache.
  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!isAuthenticated) {
        const items = readGuestCart();
        const existing = items.find((i) => i.productId === productId);
        if (existing) {
          existing.quantity = Number(quantity);
          if (existing.quantity <= 0) {
            writeGuestCart(items.filter((i) => i.productId !== productId));
          } else {
            writeGuestCart(items);
          }
        }
        return;
      }
      if (!actor) throw new Error("Actor not available");
      return actor.updateCartItemQuantity(productId, quantity);
    },
    onError: () => {
      toast.error("Could not update quantity. Please try again.");
    },
    onSuccess: () => {
      // Invalidate so React Query fetches fresh authoritative data from backend
      const queryKey = isAuthenticated ? ["cart"] : ["guestCart"];
      queryClient.invalidateQueries({ queryKey });
    },
  });

  // ── Remove item (with optimistic UI + selective cache update) ─────────────
  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!isAuthenticated) {
        const items = readGuestCart().filter((i) => i.productId !== productId);
        writeGuestCart(items);
        return;
      }
      if (!actor) throw new Error("Actor not available");
      return actor.removeFromCart(productId);
    },
    // ── Optimistic update: remove from cache INSTANTLY ────────────────────
    onMutate: async (productId) => {
      const queryKey = isAuthenticated ? ["cart"] : ["guestCart"];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<CartData>(queryKey);

      if (previous) {
        queryClient.setQueryData<CartData>(
          queryKey,
          applyOptimisticRemove(previous, productId),
        );
      }

      return { previous, queryKey };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData<CartData>(context.queryKey, context.previous);
      }
      toast.error("Could not remove item. Please try again.");
    },
    onSuccess: (_data, productId, context) => {
      const queryKey =
        context?.queryKey ?? (isAuthenticated ? ["cart"] : ["guestCart"]);
      const current = queryClient.getQueryData<CartData>(queryKey);
      if (current) {
        queryClient.setQueryData<CartData>(
          queryKey,
          applyOptimisticRemove(current, productId),
        );
      } else {
        queryClient.invalidateQueries({ queryKey });
      }
    },
  });

  // ── Clear cart ────────────────────────────────────────────────────────────
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        clearGuestCart();
        return;
      }
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    },
  });

  // ── Pick active cart data ────────────────────────────────────────────────
  const activeCart = isAuthenticated
    ? backendCartQuery.data
    : guestCartQuery.data;
  const isLoading = isAuthenticated
    ? backendCartQuery.isLoading
    : guestCartQuery.isLoading;

  const cartItemCount = useCallback(() => {
    return (
      activeCart?.items.reduce((acc, item) => acc + Number(item.quantity), 0) ||
      0
    );
  }, [activeCart]);

  return {
    cart: activeCart,
    isLoading,
    /** True while actor is still initializing — use to show loading state on buttons */
    isActorReady: !!actor && !actorFetching,
    cartItemCount: cartItemCount(),
    addToCart: (productId: string, quantity: bigint) =>
      addToCartMutation.mutateAsync({ productId, quantity }),
    isAddingToCart: addToCartMutation.isPending,
    updateQuantity: (productId: string, quantity: bigint) =>
      updateQuantityMutation.mutateAsync({ productId, quantity }),
    isUpdating: updateQuantityMutation.isPending,
    removeItem: (productId: string) =>
      removeItemMutation.mutateAsync(productId),
    clearCart: () => clearCartMutation.mutateAsync(),
  };
}
