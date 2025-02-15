import { useSuspenseQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { budgetCategories, budgets, categories, useDatabase } from '@/db';
import { BUDGET_DETAILS_QUERY } from '../keys';

export function useBudgetDetailsSuspenseQuery(budgetId: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_DETAILS_QUERY(budgetId),

    async queryFn(args) {
      const [, id] = args.queryKey;

      const [budget] = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, id));

      return {
        ...budget,

        categories: await db
          .select({
            categoryId: budgetCategories.categoryId,
            goal: budgetCategories.goal,
            name: categories.name,
          })
          .from(budgetCategories)
          .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
          .where(eq(budgetCategories.budgetId, budget.id)),
      };
    },
  });
}
