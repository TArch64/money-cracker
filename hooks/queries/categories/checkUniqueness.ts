import { useMutation } from '@tanstack/react-query';
import { categories, useDatabase } from '@/db';
import { and, eq, not } from 'drizzle-orm';

export interface ICategoryCheckUniquenessInput {
  name: string;
  excludeId?: number;
}

export function useCategoryCheckUniqueness() {
  const db = useDatabase();

  return useMutation({
    async mutationFn(input: ICategoryCheckUniquenessInput) {
      let where = eq(categories.name, input.name);

      if (input.excludeId) {
        where = and(where, not(eq(categories.id, input.excludeId)))!;
      }

      const rows = await db
        .select()
        .from(categories)
        .where(where);

      return { isUnique: !rows.length };
    },
  });
}
