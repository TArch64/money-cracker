import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RecordInsert, records, useDatabase } from '@/db';
import { useCategoryFindOrCreateMutation } from '../categories';
import { CATEGORIES_LIST_WITH_USAGE_QUERY, MONTHS_QUERY } from '../keys';

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

      return { type: input.type };
    },

    onSuccess(data) {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(data.type),
        }),
      ]);
    },
  });
}
