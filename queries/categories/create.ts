import { useMutation, useQueryClient } from '@tanstack/react-query';
import { categories, type CategoryInsert, RecordType, useDatabase } from '@/db';
import { CATEGORIES_LIST_QUERY } from '@/queries/categories/list';

export function useCategoriesCreateMutation(type: RecordType) {
  const db = useDatabase();
  const client = useQueryClient();

  return useMutation({
    async mutationFn(data: Omit<CategoryInsert, 'id' | 'type'>[]) {
      const inserts = data.map(item => ({ ...item, type }));

      await db
        .insert(categories)
        .values(inserts)
        .onConflictDoNothing({ target: categories.name });
    },
    async onSuccess() {
      await client.invalidateQueries({
        queryKey: CATEGORIES_LIST_QUERY(type)
      })
    }
  });
}
