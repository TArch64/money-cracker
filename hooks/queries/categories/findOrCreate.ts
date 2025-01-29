import { useMutation } from '@tanstack/react-query';
import { RecordType } from '@/enums';
import { categories, type Category, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';
import { useCategoryCreateMutation } from './create';

export interface ICategoryFindOrCreateInput {
  type: RecordType;
  name: string;
}

export function useCategoryFindOrCreateMutation() {
  const db = useDatabase();
  const createMutation = useCategoryCreateMutation();

  return useMutation({
    async mutationFn(input: ICategoryFindOrCreateInput): Promise<Category> {
      const [existing] = await db
        .select()
        .from(categories)
        .where(eq(categories.name, input.name));

      return existing || createMutation.mutateAsync(input);
    }
  });
}
