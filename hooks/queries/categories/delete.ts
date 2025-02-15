import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { type AppDatabase, categories, records, useDatabase } from '@/db';
import { RecordType } from '@/enums';
import { CATEGORIES_DETAILS_QUERY, CATEGORIES_LIST_QUERY } from '../keys';

export interface ICategoryDeleteInput {
  id: number;
  type: RecordType;
}

async function hasRecords(db: AppDatabase, id: number) {
  const rows = await db
    .select({ id: records.id })
    .from(records)
    .where(eq(records.categoryId, id));

  return rows.length > 0;
}

export function useCategoryDeleteMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: ICategoryDeleteInput) {
      if (await hasRecords(db, input.id)) {
        throw new Error('Cannot remove a category with records');
      }

      await db.delete(categories).where(eq(categories.id, input.id));
      return input;
    },

    onSuccess(data) {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_QUERY(data.type),
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_DETAILS_QUERY(data.id),
        }),
      ]);
    },
  });
}
