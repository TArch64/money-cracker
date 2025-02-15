import { useSuspenseQuery } from '@tanstack/react-query';
import { and, desc, eq, lt, or } from 'drizzle-orm';
import { budgets, useDatabase } from '@/db';
import { BUDGET_PREVIOUS_MONTH_QUERY } from '../keys';

export interface IMonthBudgetPrevious {
  id: number;
}

export function useBudgetPreviousMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_PREVIOUS_MONTH_QUERY(year, month),

    async queryFn(args): Promise<IMonthBudgetPrevious | null> {
      const [, , year, , month] = args.queryKey;

      const rows = await db
        .select({ id: budgets.id })
        .from(budgets)
        .where(or(
          lt(budgets.year, year),
          and(eq(budgets.year, year), lt(budgets.month, month)),
        ))
        .orderBy(desc(budgets.year), desc(budgets.month))
        .limit(1);

      return rows.length ? { id: rows[0].id } : null;
    },
  });
}
