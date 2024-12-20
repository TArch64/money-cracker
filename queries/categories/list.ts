import { categories, type Category, RecordType, useDatabase } from '@/db';
import { useSuspenseQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const CATEGORIES_LIST_QUERY = (type: RecordType) => ['categories', type, 'list'];

export function useCategoriesListQuery(type: RecordType) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: CATEGORIES_LIST_QUERY(type),

    async queryFn(): Promise<Category[]> {
      return db.select().from(categories).where(eq(categories.type, type));
    },
  });
}
