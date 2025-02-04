import { budgetCategories, budgets, useDatabase } from '@/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MonthIdx } from '@/stores';
import { BUDGET_MONTH_GOALS_QUERY, CATEGORIES_LIST_WITH_USAGE_QUERY, MONTHS_QUERY } from '../keys';
import { type BudgetInputCategory, budgetInputCategoryToInsert } from './helpers';
import { RecordType } from '@/enums';

export interface IBudgetCreateInput {
  monthIdx: MonthIdx;
  categories: BudgetInputCategory[];
}

export function useBudgetCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: IBudgetCreateInput) {
      await db.transaction(async (tx) => {
        const [budget] = await tx
          .insert(budgets)
          .values({
            year: input.monthIdx.year,
            month: input.monthIdx.month,
          })
          .returning({ id: budgets.id });

        const categoryInserts = input.categories
          .filter((category) => category.added)
          .map((category) => budgetInputCategoryToInsert(budget.id, category));

        await tx
          .insert(budgetCategories)
          .values(categoryInserts);
      });

      return { monthIdx: input.monthIdx };
    },

    onSuccess(result) {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: BUDGET_MONTH_GOALS_QUERY(result.monthIdx.year, result.monthIdx.month),
        }),

        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(RecordType.EXPENSE),
        }),

        queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(RecordType.INCOME),
        }),
      ]);
    },
  });
}
