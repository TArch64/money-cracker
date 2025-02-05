import { type ReactNode, useMemo } from 'react';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { MonthIdx, useMonthStore } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { HomeCategoryGoal } from './HomeCategoryGoal';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export function HomeGoalsList(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const budgetQuery = useBudgetMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  const dayProgress = useMemo(() => {
    const now = new Date();
    const currentMonthIdx = MonthIdx.fromDate(now);

    if (activeMonthIdx.isBefore(currentMonthIdx)) {
      return 1;
    }

    if (activeMonthIdx.isAfter(currentMonthIdx)) {
      return 0;
    }

    return now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, [activeMonthIdx.id]);

  return (
    <HomeCard
      href={() => ({
        pathname: '/budgets/[budgetId]/edit',
        params: { budgetId: budgetQuery.data!.id },
      })}
    >
      <HomeCardTitle
        linked
        title="Spending Goals"
        style={styles.title}
      />

      <View style={styles.list}>
        {budgetQuery.data!.categories.map((category) => (
          <HomeCategoryGoal
            key={category.categoryId}
            category={category}
            dayProgress={dayProgress}
          />
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
