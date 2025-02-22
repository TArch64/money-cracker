import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDatabase, type UserInsert, users } from '@/db';
import { USER_QUERY } from '../keys';

export type UserUpdate = Partial<Omit<UserInsert, 'id'>>;

export function useUserUpdateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(update: UserUpdate) {
      const [updated] = await db.update(users).set(update).returning();
      return { updated };
    },

    onSuccess({ updated }) {
      queryClient.setQueryData(USER_QUERY, updated);
    },
  });
}
