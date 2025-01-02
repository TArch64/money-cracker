import { categories, records, type RecordWithCategory, useDatabase } from '@/db';
import { useSuspenseQuery } from '@tanstack/react-query';
import { eq, getTableColumns } from 'drizzle-orm';
import { RECORDS_DETAILS_QUERY } from './keys';

export function useRecordDetailsSuspenseQuery(recordId: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_DETAILS_QUERY(recordId),

    async queryFn(args): Promise<RecordWithCategory> {
      const [, recordId] = args.queryKey;

      const [record] = await db
        .select({ ...getTableColumns(records), category: categories })
        .from(records)
        .where(eq(records.id, recordId))
        .innerJoin(categories, eq(categories.id, records.categoryId))

      return record;
    }
  });
}
