import { useQuery } from "@tanstack/react-query";
import type { Product, ProductCategory } from "../backend";
import { useActor } from "./useActor";

export function useGetProduct(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useListProducts(category: ProductCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products", category],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.listProducts(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFeaturedProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["featuredProducts"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getFeaturedProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export const useProducts = {
  useGetProduct,
  useListProducts,
  useFeaturedProducts,
};
