import { eq } from 'drizzle-orm';
import {
  type AppDatabase,
  type Budget,
  budgetCategories,
  type BudgetCategory,
  type BudgetCategoryInsert,
  type BudgetWithCategories,
  categories,
} from '@/db';

export type BudgetInputCategory = Omit<BudgetCategory, 'budgetId'> & { added: boolean };

export const budgetInputCategoryToInsert = (budgetId: number, input: BudgetInputCategory): BudgetCategoryInsert => ({
  categoryId: input.categoryId,
  goal: input.goal,
  budgetId,
});

export const fetchBudgetCategories = async (db: AppDatabase, budget: Budget): Promise<BudgetWithCategories> => ({
  ...budget,

  categories: await db
    .select({
      categoryId: budgetCategories.categoryId,
      goal: budgetCategories.goal,
      name: categories.name,
    })
    .from(budgetCategories)
    .innerJoin(categories, eq(budgetCategories.categoryId, categories.id))
    .where(eq(budgetCategories.budgetId, budget.id)),
});
