import type { ReactNode } from 'react';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { useMonthStore } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { Text } from '@ui-kitten/components';

export function HomeGoalsList(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const goalsQuery = useBudgetMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  return (
    <HomeCard>
      <HomeCardTitle title="Spending Goals" />

      {goalsQuery.data.slice(0, 5).map((goal) => (
        <Text key={goal.categoryId}>{goal.name}</Text>
      ))}
    </HomeCard>
  );
}
