import { type Record, records, useDatabase } from '@/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { RECORDS_EXISTS_QUERY, RECORDS_MONTH_LIST_QUERY } from './keys';
import { MONTHS_QUERY } from '../general';

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
          queryKey: RECORDS_EXISTS_QUERY
        }),

        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        })
      ]);
    }
  })
}
