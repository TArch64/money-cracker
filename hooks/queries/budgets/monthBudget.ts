import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import { budgetCategories, budgets, type BudgetWithCategories, categories, useDatabase } from '@/db';
import { and, eq } from 'drizzle-orm';

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<BudgetWithCategories | null> {
      const [, , year, , month] = args.queryKey;

      const budgets_ = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.year, year), eq(budgets.month, month)));

      if (!budgets_[0]) {
        return null;
      }

      return {
        ...budgets_[0],

        categories: await db
          .select({
            goal: budgetCategories.goal,
            name: categories.name,
          })
          .from(budgetCategories)
          .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
          .where(eq(budgetCategories.budgetId, budgets_[0].id)),
      };
    },
  });
}
