import type { ReactNode } from 'react';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { Button, Text } from '@ui-kitten/components';
import { useMonthStore } from '@/stores';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useBudgetPreviousMonthGoalsSuspenseQuery } from '@/hooks/queries';

export function HomeGoalsEmpty(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const previousMonthGoals = useBudgetPreviousMonthGoalsSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  return (
    <HomeCard>
      <HomeCardTitle
        title="Spending Goals"
        style={styles.title}
      />

      <Text>
        There are no goals for this month yet
      </Text>

      <View style={styles.actionRow}>
        {previousMonthGoals.data.length ? (
          <>
            <Button appearance="link" size="inline">
              Copy
            </Button>

            <Text>
              from previous month or
            </Text>

            <Button appearance="link" size="inline">
              Add New Goals
            </Button>
          </>
        ) : (
          <Button appearance="link" size="inline">
            Add Goals
          </Button>
        )}
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  } satisfies ViewStyle,

  actionRow: {
    marginTop: 4,
    gap: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,
});
