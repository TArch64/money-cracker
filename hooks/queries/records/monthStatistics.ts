import { useSuspenseQuery } from '@tanstack/react-query';
import { RECORDS_MONTH_STATISTICS_QUERY } from './keys';
import { categories, eqDate, records, sum, useDatabase } from '@/db';
import { and, eq } from 'drizzle-orm';
import { RecordType } from '@/enums';
import { useIsFocused } from '@react-navigation/core';

export interface IRecordCategoryStatistics {
  id: number;
  name: string;
  total: number;
}

export interface IRecordMonthStatistics {
  hasExpenses: boolean;
  expenseCategories: IRecordCategoryStatistics[];
  expenseTotal: number;
}

export function useRecordsMonthStatisticsSuspenseQuery(year: number, month: number) {
  const db = useDatabase();
  const isFocused = useIsFocused();

  return useSuspenseQuery({
    subscribed: isFocused,
    queryKey: RECORDS_MONTH_STATISTICS_QUERY(year, month),

    async queryFn(args): Promise<IRecordMonthStatistics> {
      const [, , year, , month] = args.queryKey;

      const expenseCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          total: sum(records.value, 'total'),
        })
        .from(records)
        .innerJoin(categories, eq(categories.id, records.categoryId))
        .where(and(
          eqDate(records.date, { year, month }),
          eq(records.type, RecordType.EXPENSE),
        ))
        .groupBy(records.categoryId);

      return {
        hasExpenses: !!expenseCategories.length,
        expenseCategories,
        expenseTotal: expenseCategories.reduce((acc, row) => acc + row.total, 0),
      };
    },
  });
}
