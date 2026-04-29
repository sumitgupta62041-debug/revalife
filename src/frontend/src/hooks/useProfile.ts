import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, UserProfile } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  // Include principal in query key so a fresh query fires for each user session.
  // An anonymous/unauthenticated user gets a different key than a logged-in user.
  const principalKey = identity
    ? identity.getPrincipal().toText()
    : "anonymous";

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile", principalKey],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const result = await actor.getCallerUserProfile();
      // Backend may return [] (empty optional) or [profile] (Motoko opt)
      if (Array.isArray(result)) {
        return result.length > 0 ? (result[0] as UserProfile) : null;
      }
      return result ?? null;
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: 1,
    staleTime: 0,
    refetchOnMount: true,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async ({
      name,
      email,
      phone,
    }: { name: string; email: string; phone: string }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.createOrUpdateProfile(name, email, phone);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUserProfile", principalKey],
      });
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async (address: Address) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addSavedAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUserProfile", principalKey],
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async ({
      index,
      address,
    }: { index: bigint; address: Address }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.updateSavedAddress(index, address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUserProfile", principalKey],
      });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSavedAddress(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["currentUserProfile", principalKey],
      });
    },
  });

  return {
    profile: profileQuery.data ?? null,
    isLoading:
      actorFetching || profileQuery.isLoading || profileQuery.isFetching,
    isFetched: !!actor && profileQuery.isFetched,
    updateProfile: (name: string, email: string, phone: string) =>
      updateProfileMutation.mutateAsync({ name, email, phone }),
    addAddress: (address: Address) => addAddressMutation.mutateAsync(address),
    updateAddress: (index: bigint, address: Address) =>
      updateAddressMutation.mutateAsync({ index, address }),
    deleteAddress: (index: bigint) => deleteAddressMutation.mutateAsync(index),
    isUpdating:
      updateProfileMutation.isPending ||
      addAddressMutation.isPending ||
      updateAddressMutation.isPending ||
      deleteAddressMutation.isPending,
  };
}
