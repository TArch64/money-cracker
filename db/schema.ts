import { index, integer, primaryKey, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core';
import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm';
import { AppLocale, IntroState, RecordType } from '@/enums';
import { date, dateUnix, enum_, sensitiveText } from './customTypes';

export const USER_ID = 1;

export const users = sqliteTable('users', {
  id: integer().primaryKey().default(USER_ID),
  intro: enum_(IntroState).notNull().default(IntroState.PENDING),
  locale: enum_(AppLocale).notNull().default(AppLocale.SYSTEM),
  anthropicKey: sensitiveText('anthropic_key'),
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;

export const categories = sqliteTable('categories', {
  id: integer().primaryKey(),
  type: enum_(RecordType).notNull(),
  name: text().notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  records: many(records),
}));

export type Category = InferSelectModel<typeof categories>;
export type CategoryInsert = InferInsertModel<typeof categories>;

export const records = sqliteTable('records', {
  id: integer().primaryKey(),
  type: enum_(RecordType).notNull(),
  value: integer().notNull(),
  date: date().notNull(),
  dateUnix: dateUnix('date').notNull(),
  categoryId: integer().references(() => categories.id, { onDelete: 'restrict' }).notNull(),
}, (t) => [
  index('records_type_idx').on(t.type),
]);

export const recordsRelations = relations(records, ({ one }) => ({
  category: one(categories, {
    fields: [records.categoryId],
    references: [categories.id],
  }),
}));

export type Record = InferSelectModel<typeof records>;
export type RecordWithCategory = Record & { category: Category };
export type RecordInsert = InferInsertModel<typeof records>;

export const budgets = sqliteTable('budgets', {
  id: integer().primaryKey(),
  year: integer().notNull(),
  month: integer().notNull(),
}, (t) => [
  unique('budgets_year_month_uniq').on(t.year, t.month),
]);

export const budgetsRelations = relations(budgets, ({ many }) => ({
  categories: many(budgetCategories),
}));

export type Budget = InferSelectModel<typeof budgets>;
export type BudgetInsert = InferInsertModel<typeof budgets>;

export const budgetCategories = sqliteTable('budget_categories', {
  budgetId: integer().references(() => budgets.id, { onDelete: 'cascade' }).notNull(),
  categoryId: integer().references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  goal: integer().notNull(),
}, (t) => [
  primaryKey({ columns: [t.budgetId, t.categoryId] }),
]);

export const budgetCategoriesRelations = relations(budgetCategories, ({ one }) => ({
  budget: one(budgets, {
    fields: [budgetCategories.budgetId],
    references: [budgets.id],
  }),

  category: one(categories, {
    fields: [budgetCategories.categoryId],
    references: [categories.id],
  }),
}));

export type BudgetCategory = InferSelectModel<typeof budgetCategories>;
export type BudgetCategoryInsert = InferInsertModel<typeof budgetCategories>;
