import { useSuspenseQuery } from '@tanstack/react-query';
import { categories, eqDate, records, type RecordWithCategory, useDatabase } from '@/db';
import { desc, eq, getTableColumns } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from './keys';

export function useRecordsMonthSuspenseQuery<D = RecordWithCategory[]>(
  year: number,
  month: number,
  select?: (data: RecordWithCategory[]) => D,
) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_LIST_QUERY(year, month),

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey;

      return db
        .select({ ...getTableColumns(records), category: categories })
        .from(records)
        .where(eqDate(records.date, { year, month }))
        .innerJoin(categories, eq(categories.id, records.categoryId))
        .orderBy(desc(records.date));
    },

    select,
  });
}
