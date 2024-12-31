import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type AppDatabase, categories, type RecordInsert, records, useDatabase } from '@/db';
import { getRecordsBoundaries, RECORDS_BOUNDARIES_QUERY } from './boundaries';
import { eq } from 'drizzle-orm';

export interface IRecordCreateInput extends Omit<RecordInsert, 'categoryId'> {
  category: string;
}

async function upsertCategory(db: AppDatabase, input: IRecordCreateInput): Promise<number> {
  const [category] = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, input.category));

  if (category) {
    return category.id;
  }

  const created = await db
    .insert(categories)
    .values({ type: input.type, name: input.category })
    .returning({ id: categories.id });

  return created[0].id;
}

export function useRecordCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: IRecordCreateInput) {
      const categoryId = await upsertCategory(db, input);

      await db
        .insert(records)
        .values({
          type: input.type,
          value: input.value,
          date: input.date,
          categoryId,
        });
    },

    async onSuccess() {
      queryClient.setQueryData(RECORDS_BOUNDARIES_QUERY, await getRecordsBoundaries(db));
    },
  });
}
