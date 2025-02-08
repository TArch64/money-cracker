import { type ReactNode, useCallback } from 'react';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { Button, Text } from '@ui-kitten/components';
import { useMonthStore } from '@/stores';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useBudgetCopyMutation, useBudgetPreviousMonthSuspenseQuery } from '@/hooks/queries';
import { Link } from 'expo-router';

export function HomeGoalsEmpty(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const previousMonthGoals = useBudgetPreviousMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);
  const copyMutation = useBudgetCopyMutation();

  const copyBudget = useCallback(() => {
    copyMutation.mutate({
      monthIdx: activeMonthIdx,
      sourceId: previousMonthGoals.data!.id,
    });
  }, []);

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
        {previousMonthGoals.data ? (
          <>
            <Button
              appearance="link"
              size="inline"
              disabled={copyMutation.isPending}
              onPress={copyBudget}
            >
              Copy
            </Button>

            <Text>
              from previous month or
            </Text>

            <Link asChild href="/budgets/new">
              <Button appearance="link" size="inline">
                Add New Goals
              </Button>
            </Link>
          </>
        ) : (
          <Link asChild href="/budgets/new">
            <Button appearance="link" size="inline">
              Add Goals
            </Button>
          </Link>
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
