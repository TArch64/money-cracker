import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AppDatabase, categories, type RecordInsert, records, useDatabase } from '@/db';
import { getRecordsBoundaries } from './boundaries';
import { eq } from 'drizzle-orm';
import { RECORDS_BOUNDARIES_QUERY, RECORDS_EXISTS_QUERY } from './keys';
import { CATEGORIES_LIST_QUERY } from '@/hooks/queries/categories/keys';

export interface IRecordCreateInput extends Omit<RecordInsert, 'categoryId'> {
  category: string;
}

async function upsertCategory(db: AppDatabase, input: IRecordCreateInput): Promise<[id: number, isNew: boolean]> {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, input.category));

  if (category) {
    return [category.id, false];
  }

  const created = await db
    .insert(categories)
    .values({ type: input.type, name: input.category })
    .returning({ id: categories.id });

  return [created[0].id, true];
}

export function useRecordCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: IRecordCreateInput) {
      const [categoryId, isNewCategory] = await upsertCategory(db, input);

      await db
        .insert(records)
        .values({
          type: input.type,
          value: input.value,
          date: input.date,
          categoryId,
        });

      return { isNewCategory, type: input.type };
    },

    async onSuccess(data) {
      queryClient.setQueryData(RECORDS_EXISTS_QUERY, true);

      const promises = [
        getRecordsBoundaries(db).then((boundaries) => {
          queryClient.setQueryData(RECORDS_BOUNDARIES_QUERY, boundaries)
        })
      ];

      if (data.isNewCategory) {
        promises.push(queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_QUERY(data.type)
        }))
      }

      return Promise.all(promises);
    },
  });
}
