import { type QueryKey, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { asc, eq } from 'drizzle-orm';
import { type AppDatabase, categories, type Category, useDatabase } from '@/db';
import { RecordType } from '@/enums';
import { CATEGORIES_LIST_QUERY } from '../keys';

async function getCategories(db: AppDatabase, type: RecordType): Promise<Category[]> {
  return db
    .select()
    .from(categories)
    .where(eq(categories.type, type))
    .orderBy(asc(categories.name));
}

export interface ICategoriesListOptions<D = Category[]> {
  type: RecordType;
  subkey?: QueryKey;
  select?: (data: Category[]) => D;
}

export function useCategoriesListQuery<D = Category[]>(options: ICategoriesListOptions<D>) {
  const db = useDatabase();

  return useQuery({
    queryKey: [
      ...CATEGORIES_LIST_QUERY(options.type),
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<Category[]> {
      const [, type] = args.queryKey as unknown as ReturnType<typeof CATEGORIES_LIST_QUERY>;
      return getCategories(db, type);
    },

    select: options.select,
    initialData: [],
  });
}

export function useCategoriesListSuspenseQuery<D = Category[]>(options: ICategoriesListOptions<D>) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: [
      ...CATEGORIES_LIST_QUERY(options.type),
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<Category[]> {
      const [, type] = args.queryKey as unknown as ReturnType<typeof CATEGORIES_LIST_QUERY>;
      return getCategories(db, type);
    },

    select: options.select,
  });
}
