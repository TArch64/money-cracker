import { type Record, records, useDatabase } from '@/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from './month';

export function useRecordDeleteMutation(record: Record) {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn() {
      await db.delete(records).where(eq(records.id, record.id));
    },

    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: RECORDS_MONTH_LIST_QUERY(record.date),
      });
    }
  })
}
