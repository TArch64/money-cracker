import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_PREVIOUS_MONTH_GOALS_QUERY } from '../keys';
import { budgetCategories, type BudgetCategory, budgets, categories, type Category, useDatabase } from '@/db';
import { and, desc, eq, lt, or } from 'drizzle-orm';

export type MonthBudgetPreviousGoal = Omit<BudgetCategory, 'budgetId'> & {
  name: Category['name'];
};

export function useBudgetPreviousMonthGoalsSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_PREVIOUS_MONTH_GOALS_QUERY(year, month),

    async queryFn(args): Promise<MonthBudgetPreviousGoal[]> {
      const [, , year, , month] = args.queryKey;

      const budgetQuery = db.$with('previous_budget').as(
        db.select({ id: budgets.id })
          .from(budgets)
          .where(or(
            lt(budgets.year, year),
            and(eq(budgets.year, year), lt(budgets.month, month)),
          ))
          .orderBy(
            desc(budgets.year),
            desc(budgets.month),
          )
          .limit(1),
      );

      return db
        .with(budgetQuery)
        .select({
          categoryId: budgetCategories.categoryId,
          goal: budgetCategories.goal,
          name: categories.name,
        })
        .from(budgetQuery)
        .innerJoin(budgetCategories, eq(budgetCategories.budgetId, budgetQuery.id))
        .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
        .where(eq(budgetCategories.budgetId, budgetQuery.id));
    },
  });
}
