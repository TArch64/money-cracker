import { useQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import {
  type AppDatabase,
  type Budget,
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
import { and, eq, notInArray } from 'drizzle-orm';
import { RecordType } from '@/enums';

export type MonthBudgetCategory = Omit<BudgetCategory, 'budgetId'>
  & Pick<Category, 'name'>
  & { spent: number; };

export type MonthBudget = Budget & {
  categories: MonthBudgetCategory[];
  other: number;
};

function getBudgetCategories(db: AppDatabase, budget: Budget): Promise<MonthBudgetCategory[]> {
  return db
    .select({
      categoryId: budgetCategories.categoryId,
      goal: budgetCategories.goal,
      spent: sum(records.value, 'spent'),
      name: categories.name,
    })
    .from(budgetCategories)
    .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
    .innerJoin(records, eq(records.categoryId, budgetCategories.categoryId))
    .where(and(
      eq(budgetCategories.budgetId, budget.id),
      eqDate(records.date, { year: budget.year, month: budget.month }),
    ))
    .groupBy(budgetCategories.categoryId);
}

async function getBudgetOther(db: AppDatabase, budget: Budget): Promise<number> {
  const rows = await db
    .select({ spent: sum(records.value, 'spent') })
    .from(records)
    .where(and(
      eqDate(records.date, { year: budget.year, month: budget.month }),
      eq(records.type, RecordType.EXPENSE),
      notInArray(records.categoryId, db
        .select({ id: budgetCategories.categoryId })
        .from(budgetCategories)
        .where(eq(budgetCategories.budgetId, budget.id)),
      ),
    ));

  return rows[0].spent;
}

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

      const [categories_, other] = await Promise.all([
        getBudgetCategories(db, budget),
        getBudgetOther(db, budget),
      ]);

      return {
        ...budget,
        categories: categories_,
        other,
      };
    },
  });
}
