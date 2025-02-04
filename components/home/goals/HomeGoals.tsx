import type { ReactNode } from 'react';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { HomeGoalsEmpty } from './HomeGoalsEmpty';

function HomeGoalsList(): ReactNode {
  return (
    <HomeCard>
      <HomeCardTitle title="Spending Goals" />
    </HomeCard>
  );
}

export function HomeGoals(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const goalsQuery = useBudgetMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);
  return goalsQuery.data.length ? <HomeGoalsList /> : <HomeGoalsEmpty />;
}
