import type { ReactNode } from 'react';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { useMonthStore } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { HomeCategoryGoal } from './HomeCategoryGoal';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export function HomeGoalsList(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const goalsQuery = useBudgetMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);
  const visibleGoals = goalsQuery.data.slice(0, 5);

  return (
    <HomeCard>
      <HomeCardTitle title="Spending Goals" style={styles.title} />

      <View style={styles.list}>
        {visibleGoals.map((category) => (
          <HomeCategoryGoal key={category.categoryId} category={category} />
        ))}
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  } satisfies ViewStyle,

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  } satisfies ViewStyle,
});
