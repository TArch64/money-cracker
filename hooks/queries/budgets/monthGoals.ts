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
import { RecordType } from '@/enums';

export type MonthBudgetGoal = Omit<BudgetCategory, 'budgetId'> & {
  name: Category['name'];
  spent: number;
};

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_GOALS_QUERY(year, month),

    async queryFn(args): Promise<MonthBudgetGoal[]> {
      const [, , year, , month] = args.queryKey;

      return db
        .select({
          categoryId: budgetCategories.categoryId,
          goal: budgetCategories.goal,
          name: categories.name,
          spent: sum(records.value, 0).as('spent'),
        })
        .from(budgets)
        .innerJoin(budgetCategories, eq(budgets.id, budgetCategories.budgetId))
        .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
        .leftJoin(records, and(
          eq(records.categoryId, budgetCategories.categoryId),
          eq(records.type, RecordType.EXPENSE),
          eqDate(records.date, { year, month }),
        ))
        .where(and(eq(budgets.year, year), eq(budgets.month, month)))
        .groupBy(budgetCategories.categoryId);
    },
  });
}
