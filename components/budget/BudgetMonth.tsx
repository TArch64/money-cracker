import type { MonthBudget } from '@/hooks/queries';
import { type ReactNode, useMemo } from 'react';
import { MonthIdx, useMonthStore } from '@/stores';
import { List } from '@ui-kitten/components';
import { BudgetCategory } from './BudgetCategory';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { BudgetOther } from './BudgetOther';

export interface IBudgetMonthProps {
  budget: MonthBudget;
}

export function BudgetMonth(props: IBudgetMonthProps): ReactNode {
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
      removeClippedSubviews
      data={props.budget.categories}
      contentContainerStyle={styles.categoryList}

      renderItem={({ item }) => (
        <BudgetCategory
          category={item}
          dayProgress={dayProgress}
        />
      )}

      ListFooterComponent={
        <View style={styles.listFooter}>
          <BudgetOther value={props.budget.other} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  categoryList: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  } satisfies ViewStyle,

  listFooter: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
  } satisfies ViewStyle,
});
