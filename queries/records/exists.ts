import { useSuspenseQuery } from '@tanstack/react-query';
import { records, useDatabase } from '@/db';

export const RECORDS_EXISTS_QUERY = ['records', 'exists'];

export function useRecordsExistsQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_EXISTS_QUERY,
    async queryFn(): Promise<boolean> {
      return !!(await db.select().from(records).limit(1)).length;
    }
  });
}
