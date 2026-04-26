import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useAdmin() {
  const { actor, isFetching } = useActor();

  const { data, isLoading } = useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isAdmin();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60_000,
  });

  return {
    isAdmin: data ?? false,
    isLoading: isLoading || isFetching,
  };
}
