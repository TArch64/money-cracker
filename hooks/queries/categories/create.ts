import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categories, type CategoryInsert, useDatabase } from '@/db';
import { CATEGORIES_LIST_QUERY } from '../keys';

export type CategoryCreateInput = Omit<CategoryInsert, 'id'>;

export function useCategoryCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: CategoryCreateInput) {
      const [created] = await db
        .insert(categories)
        .values(input)
        .onConflictDoNothing()
        .returning();

      return created;
    },

    onSuccess(data) {
      return queryClient.invalidateQueries({
        queryKey: CATEGORIES_LIST_QUERY(data.type),
      });
    },
  });
}
