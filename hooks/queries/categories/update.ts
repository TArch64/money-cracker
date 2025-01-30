import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { categories, type Category, useDatabase } from '@/db';
import { CATEGORIES_DETAILS_QUERY, CATEGORIES_LIST_QUERY } from '../keys';

export interface IUpdateCategoryInput extends Omit<Category, 'id' | 'type'> {
}

export function useCategoryUpdateMutation(category: Category) {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: IUpdateCategoryInput) {
      await db.update(categories).set(input).where(eq(categories.id, category.id));
    },

    async onSuccess() {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: CATEGORIES_DETAILS_QUERY(category.id),
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_QUERY(category.type),
        }),

        queryClient.invalidateQueries({
          queryKey: ['budgets'],
        }),

        queryClient.invalidateQueries({
          queryKey: ['records'],
        }),
      ]);
    },
  });
}
