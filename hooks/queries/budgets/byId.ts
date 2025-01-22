import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_ID_QUERY } from './keys';
import { budgetCategories, budgets, categories, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';

export function useBudgetIdSuspenseQuery(id: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_ID_QUERY(id),

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
