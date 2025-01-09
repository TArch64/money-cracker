import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_MONTH_QUERY } from './keys';
import {
  budgetCategories,
  type BudgetCategoryInsert,
  budgets,
  type BudgetWithCategories,
  categories,
  type Category,
  useDatabase,
} from '@/db';
import { and, eq, inArray, or } from 'drizzle-orm';
import { RecordType } from '@/enums';
import { groupBy, keyBy } from 'lodash-es';
import { useDataLoader } from '@/hooks/useDataLoader';
import { useCallback } from 'react';

type BudgetBatchKey = [year: number, month: number];
const BUDGET_DATA_LOADER = Symbol('BUDGET_DATA_LOADER');
const CATEGORIES_INITIAL_DATA_LOADER = Symbol('BUDGET_INITIAL_CATEGORIES_DATA_LOADER');

export function useBudgetMonthSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  const budgetDataLoader = useDataLoader(BUDGET_DATA_LOADER, async (idxes: readonly BudgetBatchKey[]): Promise<(BudgetWithCategories | null)[]> => {
    const budgets_ = await db
      .select()
      .from(budgets)
      .where(or(...idxes.map(([year, month]) => {
        return and(
          eq(budgets.year, year),
          eq(budgets.month, month),
        );
      })));

    const categories_ = await db
      .select({
        budgetId: budgetCategories.budgetId,
        goal: budgetCategories.goal,
        name: categories.name,
      })
      .from(budgetCategories)
      .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
      .where(inArray(budgetCategories.budgetId, budgets_.map((budget) => budget.id)));

    const budgetMap = keyBy(budgets_, (budget) => `${budget.year}-${budget.month}`);
    const categoryMap = groupBy(categories_, 'budgetId');

    return idxes.map(([year, month]) => {
      const budget = budgetMap[`${year}-${month}`];

      if (!budget) {
        return null;
      }

      return {
        ...budget,

        categories: categoryMap[budget.id]?.map((category) => ({
          goal: category.goal,
          name: category.name,
        })) ?? [],
      };
    });
  });

  const initialCategoriesDataLoader = useDataLoader(CATEGORIES_INITIAL_DATA_LOADER, async (keys: readonly 0[]): Promise<Category[][]> => {
    const expenseCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.type, RecordType.EXPENSE));

    return keys.map(() => expenseCategories);
  });

  const createBudget = useCallback(async (year: number, month: number): Promise<BudgetWithCategories> => {
    const expenseCategories = await initialCategoriesDataLoader.load(0);

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

      const categoryNameMap = keyBy(expenseCategories, 'id');

      return {
        ...budget,

        categories: categories_.map((category) => ({
          goal: category.goal,
          name: categoryNameMap[category.categoryId].name,
        })),
      };
    });
  }, []);

  return useSuspenseQuery({
    queryKey: BUDGET_MONTH_QUERY(year, month),

    async queryFn(args): Promise<BudgetWithCategories> {
      const [, , year, , month] = args.queryKey;
      const budget = await budgetDataLoader.load([year, month]);
      return budget ?? await createBudget(year, month);
    },
  });
}
