import type { ReactNode } from 'react';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { HomeGoalsList } from './HomeGoalsList';
import { HomeGoalsEmpty } from './HomeGoalsEmpty';

export function HomeGoals(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const budgetQuery = useBudgetMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  return budgetQuery.data ? (
    <HomeGoalsList
      budget={budgetQuery.data}
      monthIdx={activeMonthIdx}
    />
  ) : (
    <HomeGoalsEmpty />
  );
}
