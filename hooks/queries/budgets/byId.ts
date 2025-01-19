import { useSuspenseQuery } from '@tanstack/react-query';
import { BUDGET_ID_QUERY } from './keys';
import { budgets, useDatabase } from '@/db';
import { eq } from 'drizzle-orm';
import { fetchBudgetCategories } from './helpers';

export function useBudgetIdSuspenseQuery(id: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BUDGET_ID_QUERY(id),

    async queryFn(args) {
      const [, id] = args.queryKey;

      const [budget] = await db
        .select()
        .from(budgets)
        .where(eq(budgets.id, id));

      return fetchBudgetCategories(db, budget);
    },
  });
}
