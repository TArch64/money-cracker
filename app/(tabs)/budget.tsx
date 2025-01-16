import type { ReactNode } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { useMonthStore } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { Button, Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle, View } from 'react-native';

function Empty(): ReactNode {
  return (
    <View style={styles.empty}>
      <Text category="s1" style={styles.emptyHeading}>
        No budget for this month
      </Text>

      <Button appearance="ghost">
        {(txtProps) => <Text {...txtProps}>Add Budget</Text>}
      </Button>
    </View>
  );
}

export default function Budget(): ReactNode {
  const monthIdx = useMonthStore((state) => state.activeIdx);
  const budget = useBudgetMonthSuspenseQuery(monthIdx.year, monthIdx.month);

  return (
    <TabScreenLayout title="Budget">
      {budget.data ? (
        <Text>test</Text>
      ) : (
        <Empty />
      )}
    </TabScreenLayout>
  );
}

const styles = StyleSheet.create({
  empty: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyHeading: {
    marginBottom: 8,
  } satisfies TextStyle,
});
