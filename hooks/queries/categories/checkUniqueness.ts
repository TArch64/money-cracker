import { useMutation } from '@tanstack/react-query';
import { categories, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';

export interface ICategoryCheckUniquenessInput {
  name: string;
}

export function useCategoryCheckUniqueness() {
  const db = useDatabase();

  return useMutation({
    async mutationFn(input: ICategoryCheckUniquenessInput) {
      const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.name, input.name));

      return { isUnique: !rows.length };
    },
  });
}
