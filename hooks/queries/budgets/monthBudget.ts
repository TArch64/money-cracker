import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import {
  type AppDatabase,
  budgetCategories,
  type BudgetCategoryInsert,
  budgets,
  type BudgetWithCategories,
  categories,
  useDatabase,
} from '@/db';
import { and, eq } from 'drizzle-orm';
import { RecordType } from '@/enums';

async function findBudget(db: AppDatabase, year: number, month: number): Promise<BudgetWithCategories | null> {
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
      .innerJoin(categories, eq(budgetCategories.categoryId, categories.id)),
  };
}

async function createBudget(db: AppDatabase, year: number, month: number): Promise<BudgetWithCategories> {
  const expenseCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.type, RecordType.EXPENSE));

  return db.transaction(async (tx) => {
    const [budget] = await tx
      .insert(budgets)
      .values({ year, month })
      .returning();

    const categories_ = await tx
      .insert(budgetCategories)
      .values(expenseCategories.map((category): BudgetCategoryInsert => ({
        categoryId: category.id,
        budgetId: budget.id,
        goal: 0,
      })))
      .returning();

    const categoryNameMap = Object.fromEntries(
      expenseCategories.map((category) => [category.id, category.name]),
    );

    return {
      ...budget,

      categories: categories_.map((category) => ({
        goal: category.goal,
        name: categoryNameMap[category.categoryId],
      })),
    };
  });
}

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<BudgetWithCategories> {
      const [, , year, , month] = args.queryKey;
      const budget = await findBudget(db, year, month);
      return budget ?? await createBudget(db, year, month);
    },
  });
}
