import { eq } from 'drizzle-orm';
import { type AppDatabase, type Budget, budgetCategories, type BudgetWithCategories, categories } from '@/db';

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
