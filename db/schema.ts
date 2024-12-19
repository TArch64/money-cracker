import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export const expenseCategories = sqliteTable('expense_categories', {
  id: integer('id').primaryKey()
});

export type ExpenseCategory = InferSelectModel<typeof expenseCategories>;
export type ExpenseCategoryInsert = InferInsertModel<typeof expenseCategories>;
