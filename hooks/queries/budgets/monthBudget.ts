import { useQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import { budgets, type BudgetWithCategories, useDatabase } from '@/db';
import { and, eq } from 'drizzle-orm';
import { fetchBudgetCategories } from './helpers';

export function useBudgetMonthQuery(year: number, month: number) {
  const db = useDatabase();

  return useQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<BudgetWithCategories | null> {
      const [, , year, , month] = args.queryKey;

      const [budget] = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.year, year), eq(budgets.month, month)));

      return budget ? fetchBudgetCategories(db, budget) : null;
    },
  });
}
