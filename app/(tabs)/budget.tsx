import { type ReactNode, useCallback } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { useMonthStore } from '@/stores';
import { useBudgetMonthQuery } from '@/hooks/queries';
import { Button, List, Text, TopNavigationAction } from '@ui-kitten/components';
import { StyleSheet, type TextStyle, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';
import type { BudgetWithCategories } from '@/db';

function Empty(): ReactNode {
  return (
    <View style={styles.empty}>
      <Text category="s1" style={styles.emptyHeading}>
        No budget for this month
      </Text>

      <Link href="/budgets/new" asChild>
        <Button appearance="ghost">
          {(txtProps) => <Text {...txtProps}>Add Budget</Text>}
        </Button>
      </Link>
    </View>
  );
}

interface IBudgetMonthProps {
  budget: BudgetWithCategories;
}

function BudgetMonth(props: IBudgetMonthProps): ReactNode {
  return (
    <List
      data={props.budget.categories}

      renderItem={({ item }) => (
        <View>
          <Text category="s1">{item.name}</Text>
          <Text category="s2">{item.goal}</Text>
        </View>
      )}
    />
  );
}

export default function Budget(): ReactNode {
  const router = useRouter();
  const monthIdx = useMonthStore((state) => state.activeIdx);
  const budget = useBudgetMonthQuery(monthIdx.year, monthIdx.month);

  const openEdit = useCallback((): void => {
    router.push({
      pathname: '/budgets/[budgetId]/edit',
      params: { budgetId: budget.data!.id },
    });
  }, [budget.data?.id]);

  return (
    <TabScreenLayout
      title="Budget"

      headerRight={budget.data ? () => (
        <TopNavigationAction
          icon={iconRenderer(IconName.EDIT_OUTLINE)}
          onPress={openEdit}
        />
      ) : undefined}
    >
      {budget.isLoading
        ? null
        : budget.data
          ? <BudgetMonth budget={budget.data} />
          : <Empty />}
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
