import { useQuery } from '@tanstack/react-query';
import { RecordType } from '@/enums';
import { CATEGORIES_LIST_WITH_USAGE_QUERY } from '../keys';
import { budgetCategories, categories, type Category, records, useDatabase } from '@/db';
import { eq, exists, getTableColumns } from 'drizzle-orm';

export type CategoryWithUsage = Category & {
  recordExists: boolean;
  budgetExists: boolean;
};

export function useCategoriesListWithUsageQuery(type: RecordType) {
  const db = useDatabase();

  return useQuery({
    queryKey: CATEGORIES_LIST_WITH_USAGE_QUERY(type),

    async queryFn(args): Promise<CategoryWithUsage[]> {
      const [, type] = args.queryKey;

      return db
        .select({
          ...getTableColumns(categories),
          recordExists: exists(db.select().from(records).where(eq(categories.id, records.categoryId))).mapWith(Boolean).as('record_exists'),
          budgetExists: exists(db.select().from(budgetCategories).where(eq(categories.id, budgetCategories.categoryId))).mapWith(Boolean).as('budget_exists'),
        })
        .from(categories)
        .where(eq(categories.type, type));
    },
  });
}
