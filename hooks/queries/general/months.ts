import { useSuspenseQuery } from '@tanstack/react-query';
import { desc, sql } from 'drizzle-orm';
import { budgets, records, useDatabase } from '@/db';
import { MonthIdx } from '@/stores';
import { MONTHS_QUERY } from '../keys';

export function useMonthsSuspenseQuery<D = MonthIdx[]>(select?: (months: MonthIdx[]) => D) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: MONTHS_QUERY,

    async queryFn() {
      const recordsDatesQuery = db.selectDistinct({
        year: sql<number>`CAST(SUBSTR(${records.date}, 1, 4) AS INT) AS year`,
        month: sql<number>`CAST(SUBSTR(${records.date}, 6, 2) AS INT) AS month`,
      })
        .from(records);

      const budgetsDatesQuery = db.selectDistinct({
        year: budgets.year,
        month: sql<number>`${budgets.month} + 1 AS month`,
      })
        .from(budgets);

      const rows = await db.select({
        year: sql<number>`dates.year`,
        month: sql<number>`dates.month`,
      })
        .from(recordsDatesQuery.union(budgetsDatesQuery).as('dates'))
        .orderBy(desc(sql`dates.year`), desc(sql`dates.month`));

      return rows.map((row) => new MonthIdx(row.year, row.month - 1));
    },

    select,
  });
}
