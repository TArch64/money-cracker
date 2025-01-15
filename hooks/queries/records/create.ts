import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RecordInsert, records, useDatabase } from '@/db';
import { RECORDS_EXISTS_QUERY } from './keys';
import { useCategoryFindOrCreateMutation } from '../categories';
import { MONTHS_QUERY } from '../general';

export interface IRecordCreateInput extends Omit<RecordInsert, 'categoryId'> {
  category: string;
}

export function useRecordCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const findOrCreateCategoryMutation = useCategoryFindOrCreateMutation();

  return useMutation({
    async mutationFn(input: IRecordCreateInput) {
      const categoryMutation = await findOrCreateCategoryMutation.mutateAsync({
        type: input.type,
        name: input.category,
      });

      await db
        .insert(records)
        .values({
          type: input.type,
          value: input.value,
          date: input.date,
          categoryId: categoryMutation.category.id,
        });
    },

    async onSuccess() {
      queryClient.setQueryData(RECORDS_EXISTS_QUERY, true);

      await queryClient.invalidateQueries({
        queryKey: MONTHS_QUERY,
      });
    },
  });
}
