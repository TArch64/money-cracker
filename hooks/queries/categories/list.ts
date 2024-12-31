import { categories, type Category, RecordType, useDatabase } from '@/db';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';

export const CATEGORIES_LIST_QUERY = (type: RecordType) => ['categories', type, 'list'] as const;

export function useCategoriesListQuery<D = Category>(
  type: RecordType,
  select?: (data: Category[]) => D[],
) {
  const db = useDatabase();

  return useQuery({
    queryKey: CATEGORIES_LIST_QUERY(type),

    async queryFn(args): Promise<Category[]> {
      const [, type] = args.queryKey;

      return db
        .select()
        .from(categories)
        .where(eq(categories.type, type));
    },

    select,
    initialData: [],
  });
}
