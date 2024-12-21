import { type RecordInsert, records, useDatabase } from '@/db';
import { useMutation } from '@tanstack/react-query';

export function useRecordCreateMutation() {
  const db = useDatabase();

  return useMutation({
    async mutationFn(insert: RecordInsert) {
      await db.insert(records).values(insert);
    },
  });
}
