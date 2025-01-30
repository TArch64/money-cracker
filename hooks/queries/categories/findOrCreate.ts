import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RecordType } from '@/enums';
import { categories, type Category, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';
import { useCategoryCreateMutation } from './create';
import { CATEGORIES_LIST_QUERY } from '@/hooks/queries/keys';

export interface ICategoryFindOrCreateInput {
  type: RecordType;
  name: string;
}

export interface ICategoryFindOrCreateOutput {
  category: Category;
  isNew: boolean;
}

export function useCategoryFindOrCreateMutation() {
  const db = useDatabase();
  const queryClient = useQueryClient();
  const createMutation = useCategoryCreateMutation();

  return useMutation({
    async mutationFn(input: ICategoryFindOrCreateInput): Promise<ICategoryFindOrCreateOutput> {
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, input.name));

      if (existing) {
        return { isNew: false, category: existing };
      }

      return {
        isNew: true,
        category: await createMutation.mutateAsync(input),
      };
    },

    async onSuccess(data) {
      if (data.isNew) {
        await queryClient.invalidateQueries({
          queryKey: CATEGORIES_LIST_QUERY(data.category.type),
        });
      }
    }
  });
}
