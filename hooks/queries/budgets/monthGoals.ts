import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_GOALS_QUERY } from '../keys';
import {
  budgetCategories,
  type BudgetCategory,
  budgets,
  categories,
  type Category,
  eqDate,
  records,
  sum,
  useDatabase,
} from '@/db';
import { and, eq } from 'drizzle-orm';

export type MonthBudgetCategory = Omit<BudgetCategory, 'budgetId'> & {
  name: Category['name'];
  spent: number;
};

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_GOALS_QUERY(year, month),

    async queryFn(args): Promise<MonthBudgetCategory[]> {
      const [, , year, , month] = args.queryKey;

      return db
        .select({
          categoryId: budgetCategories.categoryId,
          goal: budgetCategories.goal,
          spent: sum(records.value).as('spent'),
          name: categories.name,
        })
        .from(budgetCategories)
        .innerJoin(budgets, eq(budgets.id, budgetCategories.budgetId))
        .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
        .innerJoin(records, eq(records.categoryId, budgetCategories.categoryId))
        .where(and(
          and(eq(budgets.year, year), eq(budgets.month, month)),
          eqDate(records.date, { year, month }),
        ))
        .groupBy(budgetCategories.categoryId);
    },
  });
}
