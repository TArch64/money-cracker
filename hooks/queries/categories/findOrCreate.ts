import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RecordType } from '@/enums';
import { categories, type Category, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';
import { CATEGORIES_LIST_QUERY } from '../keys';

export interface ICategoryFindOrCreateInput {
  type: RecordType;
  name: string;
}

export interface ICategoryFindOrCreateOutput {
  isNew: boolean;
  category: Category;
}

export function useCategoryFindOrCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(input: ICategoryFindOrCreateInput): Promise<ICategoryFindOrCreateOutput> {
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, input.name));

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
