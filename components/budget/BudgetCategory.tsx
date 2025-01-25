import type { MonthBudgetCategory } from '@/hooks/queries';
import type { ReactNode } from 'react';
import { ProgressBar, Text, useTheme } from '@ui-kitten/components';
import { useNumberFormatter } from '@/hooks/formatters';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface IBudgetCategoryProps {
  category: MonthBudgetCategory;
  dayProgress: number;
}

export function BudgetCategory(props: IBudgetCategoryProps): ReactNode {
  const theme = useTheme();
  const numberFormatter = useNumberFormatter();
  const progress = props.category.spent / props.category.goal;
  const status = progress > 1 ? 'danger' : progress > 0.8 ? 'warning' : 'primary';
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

const styles = StyleSheet.create({
  category: {
    padding: 8,
  } satisfies ViewStyle,

  categoryRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
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
