import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address, UserProfile } from "../backend";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;

  const profileQuery = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
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
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });

  const addAddressMutation = useMutation({
    mutationFn: async (address: Address) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addSavedAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
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
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });

  const deleteAddressMutation = useMutation({
    mutationFn: async (index: bigint) => {
      if (!actor) throw new Error("Actor not available");
      return actor.deleteSavedAddress(index);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: actorFetching || profileQuery.isLoading,
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
