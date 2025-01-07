import { categories, type Category, useDatabase } from '@/db';
import { useQuery } from '@tanstack/react-query';
import { inArray } from 'drizzle-orm';
import { CATEGORIES_LIST_QUERY } from './keys';
import { RecordType } from '@/enums';
import { useDataLoader } from '@/hooks/useDataLoader';
import { groupBy, uniq } from 'lodash-es';

const CATEGORIES_DATA_LOADER = Symbol('CATEGORIES_DATA_LOADER');

export function useCategoriesListQuery<D = Category[]>(
  type: RecordType,
  select?: (data: Category[]) => D,
) {
  const db = useDatabase();

  const dataLoader = useDataLoader(CATEGORIES_DATA_LOADER, async (types: readonly RecordType[]): Promise<Category[][]> => {
    const categories_ = await db
      .select()
      .from(categories)
      .where(inArray(categories.type, uniq(types)));

    const grouped = groupBy(categories_, 'type');
    return types.map((type) => grouped[type] || []);
  });

  return useQuery({
    queryKey: CATEGORIES_LIST_QUERY(type),

    async queryFn(args): Promise<Category[]> {
      const [, type] = args.queryKey;
      return dataLoader.load(type);
    },

    select,
    initialData: [],
  });
}
