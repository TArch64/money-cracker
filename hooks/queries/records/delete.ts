import { type Record, records, useDatabase } from '@/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from './keys';
import { MONTHS_QUERY } from '../general';
import { CATEGORIES_LIST_WITH_USAGE_QUERY } from '@/hooks/queries';

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
          queryKey: RECORDS_MONTH_LIST_QUERY(record.date),
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(record.type),
        }),

        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        })
      ]);
    }
  })
}
