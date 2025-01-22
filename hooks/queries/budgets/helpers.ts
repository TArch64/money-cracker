import { type BudgetCategory, type BudgetCategoryInsert } from '@/db';

export type BudgetInputCategory = Omit<BudgetCategory, 'budgetId'> & { added: boolean };

export const budgetInputCategoryToInsert = (budgetId: number, input: BudgetInputCategory): BudgetCategoryInsert => ({
  categoryId: input.categoryId,
  goal: input.goal,
  budgetId,
});
