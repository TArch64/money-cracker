import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from '../keys';
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
import { and, asc, eq } from 'drizzle-orm';
import { RecordType } from '@/enums';

export type MonthBudgetCategory = Omit<BudgetCategory, 'budgetId'> & {
  name: Category['name'];
  spent: number;
};

export interface IMonthBudget {
  id: number;
  categories: MonthBudgetCategory[];
}

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<IMonthBudget | null> {
      const [, , year, , month] = args.queryKey;

      const [budget] = await db
        .select({ id: budgets.id })
        .from(budgets)
        .where(and(eq(budgets.year, year), eq(budgets.month, month)))

      if (!budget) {
        return null;
      }

      const categories_ = await db
        .select({
          categoryId: budgetCategories.categoryId,
          goal: budgetCategories.goal,
          name: categories.name,
          spent: sum(records.value, 0).as('spent'),
        })
        .from(budgetCategories)
        .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
        .leftJoin(records, and(
          eq(records.categoryId, budgetCategories.categoryId),
          eq(records.type, RecordType.EXPENSE),
          eqDate(records.date, { year, month }),
        ))
        .where(eq(budgetCategories.budgetId, budget.id))
        .groupBy(budgetCategories.categoryId)
        .orderBy(asc(categories.name));

      return {
        id: budget.id,
        categories: categories_,
      };
    },
  });
}
