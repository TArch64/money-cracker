import { useQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import {
  type Budget,
  budgetCategories,
  type BudgetCategory,
  budgets,
  categories,
  type Category,
  eqDate,
  records,
  useDatabase,
} from '@/db';
import { and, eq, sql } from 'drizzle-orm';

export type MonthBudgetCategory = Omit<BudgetCategory, 'budgetId'>
  & Pick<Category, 'name'>
  & { spent: number; };

export type MonthBudget = Budget & {
  categories: MonthBudgetCategory[]
};

export function useBudgetMonthQuery(year: number, month: number) {
  const db = useDatabase();

  return useQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<MonthBudget | null> {
      const [, , year, , month] = args.queryKey;

      const [budget] = await db
        .select()
        .from(budgets)
        .where(and(eq(budgets.year, year), eq(budgets.month, month)));

      if (!budget) {
        return null;
      }

      return {
        ...budget,

        categories: await db
          .select({
            categoryId: budgetCategories.categoryId,
            goal: budgetCategories.goal,
            // language=SQL format=false
            spent: sql<number>`SUM(${records.value}) as spent`,
            name: categories.name,
          })
          .from(budgetCategories)
          .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
          .innerJoin(records, eq(records.categoryId, budgetCategories.categoryId))
          .where(and(
            eq(budgetCategories.budgetId, budget.id),
            eqDate(records.date, { year, month }),
          ))
          .groupBy(budgetCategories.categoryId),
      };
    },
  });
}
