import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type RecordInsert, records, useDatabase } from '@/db';
import { getRecordsBoundaries, RECORDS_BOUNDARIES_QUERY } from './boundaries';

export function useRecordCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(insert: RecordInsert) {
      await db.insert(records).values(insert);
    },

    async onSuccess() {
      queryClient.setQueryData(RECORDS_BOUNDARIES_QUERY, await getRecordsBoundaries(db));
    },
  });
}
