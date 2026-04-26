import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProductWithQuantity } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useCart() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const cartQuery = useQuery<{
    items: ProductWithQuantity[];
    subtotal: bigint;
  }>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCart();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addToCart(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: { productId: string; quantity: bigint }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateCartItemQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("Actor not available");
      return actor.removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const cartItemCount =
    cartQuery.data?.items.reduce(
      (acc, item) => acc + Number(item.quantity),
      0,
    ) || 0;

  return {
    cart: cartQuery.data,
    isLoading: cartQuery.isLoading,
    cartItemCount,
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
