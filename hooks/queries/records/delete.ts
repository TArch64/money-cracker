import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { type Record, records, useDatabase } from '@/db';
import { BALANCE_QUERY, CATEGORIES_LIST_WITH_USAGE_QUERY, MONTHS_QUERY, RECORDS_MONTH_LIST_QUERY } from '../keys';

export function useRecordDeleteMutation(record: Record) {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn() {
      await db.delete(records).where(eq(records.id, record.id));
    },

    onSuccess() {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: RECORDS_MONTH_LIST_QUERY(record.date.getFullYear(), record.date.getMonth()),
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(record.type),
        }),

        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        }),

        queryClient.invalidateQueries({
          queryKey: BALANCE_QUERY,
        }),
      ]);
    },
  });
}
