import { type ReactNode, useCallback, useMemo } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { MonthIdx, useMonthStore } from '@/stores';
import { type MonthBudget, type MonthBudgetCategory, useBudgetMonthQuery } from '@/hooks/queries';
import { Button, List, ProgressBar, Text, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { useNumberFormatter } from '@/hooks/formatters';

const Empty = (): ReactNode => (
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

interface IBudgetCategoryProps {
  category: MonthBudgetCategory;
  dayProgress: number;
}

function BudgetCategory(props: IBudgetCategoryProps): ReactNode {
  const theme = useTheme();
  const numberFormatter = useNumberFormatter();
  const progress = props.category.spent / props.category.goal;
  const status = progress > 1 ? 'danger' : progress > 0.8 ? 'warning' : 'success';
  const spent = numberFormatter.format(props.category.spent);
  const goal = numberFormatter.format(props.category.goal);

  return (
    <View style={styles.category}>
      <View style={styles.categoryRow}>
        <Text>
          {props.category.name}
        </Text>

        <Text>
          <Text category="p2">{spent}</Text>
          <Text category="s2"> / {goal}</Text>
        </Text>
      </View>

      <View>
        <ProgressBar
          progress={progress}
          animating={false}
          status={status}
          size="large"
        />

        {props.dayProgress > 0 && props.dayProgress < 1 && (
          <View
            style={[
              styles.dayProgress,
              {
                backgroundColor: theme['color-basic-700'],
                left: `${props.dayProgress * 100}%`,
              },
            ] satisfies StyleProp<ViewStyle>}
          />
        )}
      </View>
    </View>
  );
}

interface IBudgetMonthProps {
  budget: MonthBudget;
}

function BudgetMonth(props: IBudgetMonthProps): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);

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
    <List
      data={props.budget.categories}
      contentContainerStyle={styles.categoryList}
      renderItem={({ item }) => (
        <BudgetCategory
          category={item}
          dayProgress={dayProgress}
        />
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

  categoryList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  } satisfies ViewStyle,

  category: {
    padding: 8,
  } satisfies ViewStyle,

  categoryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
    paddingHorizontal: 1,
  } satisfies ViewStyle,

  dayProgress: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 2,
    height: 16,
  } satisfies ViewStyle,
});
