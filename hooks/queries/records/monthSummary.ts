import { useSuspenseQuery } from '@tanstack/react-query';
import { RECORDS_MONTH_SUMMARY_QUERY } from '../keys';
import { eqDate, records, sum, useDatabase } from '@/db';
import { RecordType } from '@/enums';

export function useRecordsMonthSummarySuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_SUMMARY_QUERY(year, month),

    async queryFn(args) {
      const [, , year, , month] = args.queryKey;

      const [row1, row2] = await db
        .select({
          type: records.type,
          total: sum(records.value).as('total'),
        })
        .from(records)
        .where(eqDate(records.date, { year, month }))
        .groupBy(records.type);

      const incomeTotal = row1?.type === RecordType.INCOME ? row1.total : row2?.total;
      const expenseTotal = row1?.type === RecordType.EXPENSE ? row1.total : row2?.total;

      return {
        expenseTotal: expenseTotal ?? 0,
        incomeTotal: incomeTotal ?? 0,
      };
    },
  });
}
