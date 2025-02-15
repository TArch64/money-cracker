import { useMutation } from '@tanstack/react-query';
import { eq, sql } from 'drizzle-orm';
import { MonthIdx } from '@/stores';
import { budgetCategories, useDatabase } from '@/db';
import { useBudgetCreateMutation } from './create';

export interface IBudgetCopyInput {
  monthIdx: MonthIdx;
  sourceId: number;
}

export function useBudgetCopyMutation() {
  const db = useDatabase();
  const createMutation = useBudgetCreateMutation();

  return useMutation({
    async mutationFn(input: IBudgetCopyInput) {
      const categories = await db
        .select({
          categoryId: budgetCategories.categoryId,
          goal: budgetCategories.goal,
          added: sql`1`.mapWith(Boolean),
        })
        .from(budgetCategories)
        .where(eq(budgetCategories.budgetId, input.sourceId));

      await createMutation.mutateAsync({
        monthIdx: input.monthIdx,
        categories,
      });
    },
  });
}
