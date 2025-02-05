import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import type { MonthBudgetGoal } from '@/hooks/queries';
import { ProgressBar, Text } from '@ui-kitten/components';
import { useMoneyFormatter, useNumberFormatter } from '@/hooks/formatters';

export interface IHomeGoalProps {
  category: MonthBudgetGoal;
}

export function HomeCategoryGoal(props: IHomeGoalProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const numberFormatter = useNumberFormatter();
  const spent = numberFormatter.format(props.category.spent);
  const goal = moneyFormatter.format(props.category.goal);
  const progress = props.category.spent / props.category.goal;
  const status = progress > 1 ? 'danger' : progress > 0.8 ? 'warning' : 'primary';

  return (
    <View>
      <View style={styles.textRow}>
        <Text category="p2">
          {props.category.name}
        </Text>

        <Text category="p2">
          {spent} / {goal}
        </Text>
      </View>

      <ProgressBar
        progress={progress}
        animating={false}
        status={status}
        size="giant"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    paddingHorizontal: 1,
  } satisfies ViewStyle,
});
