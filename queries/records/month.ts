import { useSuspenseQuery } from '@tanstack/react-query';
import { type Record, records, useDatabase } from '@/db';
import { eqDate } from '@/db/customTypes';

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

    async queryFn(args): Promise<Record[]> {
      const [, , year, , month] = args.queryKey;

      return db
        .select()
        .from(records)
        .where(eqDate(records.date, { year, month }));
    },
  });
}
