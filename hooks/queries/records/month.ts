import { useSuspenseQuery } from '@tanstack/react-query';
import { categories, records, type RecordWithCategory, useDatabase, eqDate } from '@/db';
import { desc, eq } from 'drizzle-orm';

type QueryKey = [string, string, year: number, string, month: number, string];

export function RECORDS_MONTH_LIST_QUERY(date: Date): QueryKey;
export function RECORDS_MONTH_LIST_QUERY(year: number, month: number): QueryKey;

export function RECORDS_MONTH_LIST_QUERY(yearOrDate: number | Date, month?: number): QueryKey {
  const date = yearOrDate instanceof Date ? yearOrDate : undefined;

  return [
    'records',
    'year',
    date?.getFullYear() ?? yearOrDate as number,
    'month',
    date?.getMonth() ?? month!,
    'list',
  ] as const;
}

export function useRecordsMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_LIST_QUERY(year, month),

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey;

      const list = await db
        .select()
        .from(records)
        .where(eqDate(records.date, { year, month }))
        .innerJoin(categories, eq(categories.id, records.categoryId))
        .orderBy(desc(records.date));

      return list.map(({ records, categories }) => ({
        ...records,
        category: categories,
      }));
    },
  });
}
