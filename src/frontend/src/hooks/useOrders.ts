import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Address,
  CustomerDetails,
  Order,
  PaymentMethod,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetOrderById(orderId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  return useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOrderById(orderId);
    },
    enabled: !!actor && !isFetching && isAuthenticated && !!orderId,
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  const isAuthenticated = !!identity;

  return useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching && isAuthenticated,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      customerDetails,
      shippingAddress,
      paymentMethod,
    }: {
      customerDetails: CustomerDetails;
      shippingAddress: Address;
      paymentMethod: PaymentMethod;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createOrder(customerDetails, shippingAddress, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export const useOrders = {
  useGetOrderById,
  useGetUserOrders,
  useCreateOrder: () => {
    const mutation = useCreateOrder();
    return {
      createOrder: (
        customerDetails: CustomerDetails,
        shippingAddress: Address,
        paymentMethod: PaymentMethod,
      ) =>
        mutation.mutateAsync({
          customerDetails,
          shippingAddress,
          paymentMethod,
        }),
      isCreating: mutation.isPending,
    };
  },
};
