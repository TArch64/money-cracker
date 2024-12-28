import { useSuspenseQuery } from '@tanstack/react-query';
import { categories, records, type RecordWithCategory, useDatabase } from '@/db';
import { eqDate } from '@/db/customTypes';
import { eq } from 'drizzle-orm';

export const RECORDS_MONTH_LIST_QUERY = (year: number, month: number) => [
  'records',
  'year',
  year,
  'month',
  month,
  'list',
] as const;

export function useRecordsMonthQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_LIST_QUERY(year, month),

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey;

      const list = await db
        .select()
        .from(records)
        .where(eqDate(records.date, { year, month }))
        .innerJoin(categories, eq(categories.id, records.categoryId));

      return list.map(({ records, categories }) => ({
        ...records,
        category: categories,
      }));
    },
  });
}
