import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type Record, records, type RecordWithCategory, useDatabase } from '@/db';
import { RECORDS_DETAILS_QUERY, RECORDS_MONTH_LIST_QUERY } from './keys';
import { useCategoryFindOrCreateMutation } from '../categories';
import { eq } from 'drizzle-orm';
import { MONTHS_QUERY } from '../general';

export interface IUpdateRecordInput extends Omit<Record, 'id' | 'categoryId' | 'dateUnix' | 'type'> {
  category: string;
}

export function useRecordUpdateMutation(record: RecordWithCategory) {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const findOrCreateCategoryMutation = useCategoryFindOrCreateMutation();

  return useMutation({
    async mutationFn(input: IUpdateRecordInput) {
      const categoryMutation = await findOrCreateCategoryMutation.mutateAsync({
        type: record.type,
        name: input.category,
      });

      await db
        .update(records)
        .set({
          value: input.value,
          categoryId: categoryMutation.category.id,
          date: input.date,
        })
        .where(eq(records.id, record.id));

      return {
        newDate: input.date,
      };
    },

    async onSuccess(data): Promise<void> {
      const promises: Promise<any>[] = [
        queryClient.invalidateQueries({
          queryKey: RECORDS_MONTH_LIST_QUERY(record.date),
        }),
        queryClient.invalidateQueries({
          queryKey: RECORDS_DETAILS_QUERY(record.id),
        }),
        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        }),
      ];

      if (
        data.newDate.getFullYear() !== record.date.getFullYear() ||
        data.newDate.getMonth() !== record.date.getMonth()
      ) {
        promises.push(queryClient.invalidateQueries({
          queryKey: RECORDS_MONTH_LIST_QUERY(data.newDate),
        }));
      }

      await Promise.all(promises);
    },
  });
}
