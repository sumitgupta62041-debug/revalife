import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export function useClaimAdminIfNoneExists() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.claimAdminIfNoneExists();
      if (result.__kind__ === "err") throw new Error(result.err);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isAdmin"] });
    },
  });
}
