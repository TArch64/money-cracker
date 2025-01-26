import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase, type UserInsert, users } from '@/db';
import { USER_QUERY } from '../keys';

export type UserUpdate = Partial<Omit<UserInsert, 'id'>>;

export function useUserUpdateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(update: UserUpdate) {
      await db.update(users).set(update);
    },

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: USER_QUERY,
      });
    },
  });
}
