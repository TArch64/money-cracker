import { useSuspenseQuery } from '@tanstack/react-query';
import { RECORDS_MONTH_STATISTICS_QUERY } from './keys';
import { categories, eqDate, records, useDatabase } from '@/db';
import { and, eq, sql } from 'drizzle-orm';
import { RecordType } from '@/enums';

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

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_STATISTICS_QUERY(year, month),

    async queryFn(args): Promise<IRecordMonthStatistics> {
      const [, , year, , month] = args.queryKey;

      const expenseCategories = await db
        .select({
          id: categories.id,
          name: categories.name,
          // language=SQL format=false
          total: sql<number>`SUM(
          ${records.value}
          )
          AS
          total`,
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
