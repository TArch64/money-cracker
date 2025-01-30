import { useSuspenseQuery } from '@tanstack/react-query';
import { CATEGORIES_DETAILS_QUERY } from '../keys';
import { categories, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';

export function useCategoryDetailsSuspenseQuery(categoryId: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: CATEGORIES_DETAILS_QUERY(categoryId),

    async queryFn(args) {
      const [, categoryId] = args.queryKey;

      const [category] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, categoryId));

      return category;
    },
  });
}
