import type {
  UserAccess,
  UserProfile,
} from "@/features/users/model/user-schema";
import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getUsers,
  getUser,
  updateUserAccess,
  updateUserProfile,
} from "@/features/users/api/user-api";

export const userKeys = {
  all: ["users"] as const,
  list: ["users", "list"] as const,
  detail: (id: string) => ["users", "detail", id] as const,
};
export const usersQueryOptions = () =>
  queryOptions({ queryKey: userKeys.list, queryFn: getUsers });
export const userQueryOptions = (id: string) =>
  queryOptions({ queryKey: userKeys.detail(id), queryFn: () => getUser(id) });

export function useUpdateUserAccessMutation(
  userId: string,
  onSaved: () => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: UserAccess) => updateUserAccess(userId, input),
    onSuccess: async (updated) => {
      client.setQueryData(userKeys.detail(userId), updated);
      await client.invalidateQueries({ queryKey: userKeys.all });
      onSaved();
    },
  });
}

export function useUpdateUserProfileMutation(
  userId: string,
  onSaved: () => void,
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: UserProfile) => updateUserProfile(userId, input),
    onSuccess: async (updated) => {
      client.setQueryData(userKeys.detail(userId), updated);
      await client.invalidateQueries({ queryKey: userKeys.all });
      onSaved();
    },
  });
}
