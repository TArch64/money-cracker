import { categories, type Category, useDatabase } from '@/db';
import { useQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { CATEGORIES_LIST_QUERY } from './keys';
import { RecordType } from '@/enums';

export function useCategoriesListQuery<D = Category[]>(
  type: RecordType,
  select?: (data: Category[]) => D,
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
