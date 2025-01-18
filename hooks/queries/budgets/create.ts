import { budgetCategories, type BudgetCategory, budgets, useDatabase } from '@/db';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MonthIdx } from '@/stores';
import { BUDGET_MONTH_QUERY } from './keys';
import { MONTHS_QUERY } from '../general';

export type BudgetCreateCategory = Omit<BudgetCategory, 'budgetId'>;

export interface IBudgetCreateInput {
  monthIdx: MonthIdx;
  categories: BudgetCreateCategory[];
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

        await tx
          .insert(budgetCategories)
          .values(input.categories.map((category) => ({
            ...category,
            budgetId: budget.id,
          })));
      });

      return { monthIdx: input.monthIdx };
    },

    onSuccess(result) {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: BUDGET_MONTH_QUERY(result.monthIdx.year, result.monthIdx.month),
        }),

        queryClient.invalidateQueries({
          queryKey: MONTHS_QUERY,
        }),
      ]);
    },
  });
}
