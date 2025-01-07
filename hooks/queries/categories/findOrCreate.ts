import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RecordType } from '@/enums';
import { categories, type Category, useDatabase } from '@/db';
import { inArray } from 'drizzle-orm';
import { CATEGORIES_LIST_QUERY } from './keys';
import { useDataLoader } from '@/hooks/useDataLoader';
import { keyBy, uniq } from 'lodash-es';

export interface ICategoryFindOrCreateInput {
  type: RecordType;
  name: string;
}

export interface ICategoryFindOrCreateOutput {
  isNew: boolean;
  category: Category;
}

const FIND_DATA_LOADER = Symbol('CATEGORY_FIND_DATA_LOADER');

export function useCategoryFindOrCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  const dataLoader = useDataLoader(FIND_DATA_LOADER, async (names: readonly string[]): Promise<(Category | null)[]> => {
    const categories_ = await db
      .select()
      .from(categories)
      .where(inArray(categories.name, uniq(names)));

    const nameMap = keyBy(categories_, 'name');
    return names.map((name) => nameMap[name] || null);
  });

  return useMutation({
    async mutationFn(input: ICategoryFindOrCreateInput): Promise<ICategoryFindOrCreateOutput> {
      const existing = await dataLoader.load(input.name);

      if (existing) {
        return { isNew: false, category: existing };
      }

      const [created] = await db
        .insert(categories)
        .values(input)
        .returning();

      return { isNew: true, category: created };
    },

    async onSuccess(data) {
      if (data.isNew) {
        await queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_QUERY(data.category.type),
        });
      }
    },
  });
}
