import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import type { MonthBudgetCategory } from '@/hooks/queries';
import { ProgressBar, Text, useTheme } from '@ui-kitten/components';
import { useMoneyFormatter, useNumberFormatter } from '@/hooks/formatters';
import Svg, { Polygon } from 'react-native-svg';

export interface IHomeGoalProps {
  category: MonthBudgetCategory;
  dayProgress: number;
}

export function HomeCategoryGoal(props: IHomeGoalProps): ReactNode {
  const theme = useTheme();
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

      <View>
        <ProgressBar
          progress={progress}
          animating={false}
          status={status}
          size="giant"
        />

        {props.dayProgress > 0 && props.dayProgress < 1 && (
          <Svg
            viewBox="0 0 8 8"
            style={[
              styles.dayIndicator,
              {
                left: `${props.dayProgress * 100}%`,
                transform: [
                  { translateX: -5 },
                ],
              },
            ] satisfies StyleProp<ViewStyle>}
          >
            <Polygon points="4,0 8,7 0,7" fill={theme['color-basic-700']} />
          </Svg>
        )}
      </View>
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

  dayIndicator: {
    width: 8,
    height: 8,
    position: 'absolute',
    bottom: -7,
  } satisfies ViewStyle,
});
