import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Address,
  CustomerDetails,
  Order,
  PaymentMethod,
  ReturnReason,
} from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useGetOrderById(orderId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getOrderById(orderId);
    },
    enabled: !!actor && !isFetching && !!identity && !!orderId,
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Order[]>({
    queryKey: ["userOrders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
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
      if (!identity) throw new Error("You must be logged in to place an order");
      if (!actor) throw new Error("Actor not available — please try again");
      return actor.createOrder(customerDetails, shippingAddress, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 1000,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      newStatus,
    }: {
      orderId: string;
      newStatus: import("../backend").OrderStatus;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateOrderStatus(orderId, newStatus);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allOrders"] });
    },
  });
}

export function useCancelOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason?: string;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.cancelOrder(orderId, reason ?? null);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export function useRequestReturn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason: ReturnReason;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.requestReturn(orderId, reason);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
}

export function useRequestReplace() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reason,
    }: {
      orderId: string;
      reason: ReturnReason;
    }) => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.requestReplace(orderId, reason);
      if (result.__kind__ === "err") throw new Error(result.err);
      return result;
    },
    onSuccess: () => {
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
