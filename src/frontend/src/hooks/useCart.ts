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
        throw new Error("NOT_AUTHENTICATED");
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
      // NOT_AUTHENTICATED errors are handled upstream (ProductCard / ProductDetail
      // pre-check auth before calling addToCart and show the login modal instead).
      // We suppress the toast here so the user never sees a confusing error message.
      if (err instanceof Error && err.message === "NOT_AUTHENTICATED") return;
      toast.error("Could not add to cart. Please try again.");
    },
    onSuccess: (_data, _vars, context) => {
      if (context?.isGuest) {
        queryClient.invalidateQueries({ queryKey: ["guestCart"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
    },
  });

  // ── Update quantity ───────────────────────────────────────────────────────
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
            const filtered = items.filter((i) => i.productId !== productId);
            writeGuestCart(filtered);
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
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["guestCart"] });
    },
  });

  // ── Remove item ──────────────────────────────────────────────────────────
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
    onError: () => {
      toast.error("Could not remove item. Please try again.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["guestCart"] });
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
