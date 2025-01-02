import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { type InferInsertModel, type InferSelectModel, relations, sql } from 'drizzle-orm';
import { RecordType } from '@/enums';
import { date } from './customTypes';

const recordTypeEnum = Object.values(RecordType) as [RecordType, ...RecordType[]];

export const categories = sqliteTable('categories', {
  id: integer().primaryKey(),
  type: text({ enum: recordTypeEnum }).notNull(),
  name: text().notNull().unique(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  records: many(records),
}));

export type Category = InferSelectModel<typeof categories>;
export type CategoryInsert = InferInsertModel<typeof categories>;

export const records = sqliteTable('records', {
  id: integer().primaryKey(),
  type: text({ enum: recordTypeEnum }).notNull(),
  value: integer().notNull(),
  date: date().notNull(),
  dateUnix: integer().notNull().generatedAlwaysAs(sql`UNIXEPOCH(date)`, { mode: 'stored' }),
  categoryId: integer().references(() => categories.id, { onDelete: 'restrict' }).notNull()
}, (t) => [
  index('records_type_idx').on(t.type),
]);

export const recordsRelations = relations(records, ({ one }) => ({
  category: one(categories, {
    fields: [records.categoryId],
    references: [categories.id],
  })
}));

export type Record = InferSelectModel<typeof records>;
export type RecordWithCategory = Record & { category: Category };
export type RecordInsert = InferInsertModel<typeof records>;
