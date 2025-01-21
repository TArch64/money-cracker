import { useMutation, useQueryClient } from '@tanstack/react-query';
import { type BudgetInputCategory, budgetInputCategoryToInsert } from './helpers';
import {
  budgetCategories,
  type BudgetCategory,
  type BudgetCategoryInsert,
  budgets,
  bulkUpdate,
  useDatabase,
} from '@/db';
import { and, eq, inArray } from 'drizzle-orm';
import { BUDGET_ID_QUERY, BUDGET_MONTH_QUERY } from './keys';

export interface IBudgetUpdateInput {
  id: number;
  categories: BudgetInputCategory[];
}

interface IPreparedCategories {
  added: BudgetInputCategory[];
  removedIds: number[];
  updated: BudgetInputCategory[];
}

function prepareCategories(input: IBudgetUpdateInput, categories: BudgetCategory[]): IPreparedCategories {
  const added: BudgetInputCategory[] = [];
  const removedIds: number[] = [];
  const updated: BudgetInputCategory[] = [];

  const currentlyAddedIdMap = Object.fromEntries(
    categories.map((category) => [category.categoryId, category]),
  );

  for (const category of input.categories) {
    if (!category.added) {
      if (currentlyAddedIdMap[category.categoryId]) {
        removedIds.push(category.categoryId);
      }
      continue;
    }

    if (currentlyAddedIdMap[category.categoryId]) {
      if (currentlyAddedIdMap[category.categoryId].goal !== category.goal) {
        updated.push(category);
      }
      continue;
    }

    added.push(category);
  }

  return { added, removedIds, updated };
}

export function useBudgetUpdateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: IBudgetUpdateInput) {
      const [budget] = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, input.id));

      const categories_ = await db
        .select()
        .from(budgetCategories)
        .where(eq(budgetCategories.budgetId, budget.id));

      const { added, removedIds, updated } = prepareCategories(input, categories_);

      if (!added.length && !removedIds.length && !updated.length) {
        return { budget };
      }

      await db.transaction((tx) => Promise.all([
        added.length && tx
          .insert(budgetCategories)
          .values(added.map((category) => budgetInputCategoryToInsert(budget.id, category))),

        removedIds.length && tx
          .delete(budgetCategories)
          .where(and(
            eq(budgetCategories.budgetId, budget.id),
            inArray(budgetCategories.categoryId, removedIds),
          )),

        updated.length && tx.run(bulkUpdate({
          idColumn: budgetCategories.categoryId,

          updates: updated.map((category): Omit<BudgetCategoryInsert, 'budgetId'> => ({
            categoryId: category.categoryId,
            goal: category.goal,
          })),

          columns: {
            categoryId: budgetCategories.categoryId,
            goal: budgetCategories.goal,
          },

          where: eq(budgetCategories.budgetId, budget.id),
        })),
      ].filter(Boolean)));

      return { budget };
    },

    async onSuccess({ budget }) {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: BUDGET_ID_QUERY(budget.id),
        }),

        queryClient.invalidateQueries({
          queryKey: BUDGET_MONTH_QUERY(budget.year, budget.month),
        }),
      ]);
    },
  });
}
