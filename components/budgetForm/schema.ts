import { array, boolean, type InferOutput, minValue, number, object, pipe } from 'valibot';

export const budgetCategorySchema = () => object({
  id: number(),
  added: boolean(),
  goal: pipe(number(), minValue(0, 'Goal cannot be negative')),
});

export type BudgetCategorySchema = ReturnType<typeof budgetCategorySchema>;
export type FormBudgetCategory = InferOutput<BudgetCategorySchema>;

export const budgetSchema = () => object({
  categories: array(budgetCategorySchema()),
});

export type BudgetSchema = ReturnType<typeof budgetSchema>;
export type FormBudget = InferOutput<BudgetSchema>;
