import { useSuspenseQuery } from '@tanstack/react-query';
import { records, useDatabase } from '@/db';
import { RECORDS_EXISTS_QUERY } from './keys';

export function useRecordsExistsSuspenseQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_EXISTS_QUERY,

    async queryFn(): Promise<boolean> {
      return !!(await db.select().from(records).limit(1)).length;
    }
  });
}
