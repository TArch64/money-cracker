import { MonthIdx, useMonthStore } from '@/stores';
import type { ReactNode } from 'react';
import { useDateFormatter } from '@/hooks/formatters';
import { ListItem, useTheme } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';

export interface ISwitcherMonthProps {
  monthIdx: MonthIdx;
}

export function SwitcherMonth(props: ISwitcherMonthProps): ReactNode {
  const theme = useTheme();
  const dateFormatter = useDateFormatter({ month: 'long' });
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const activateMonthIdx = useMonthStore((state) => state.activateIdx);

  return (
    <ListItem
      style={[
        styles.month,

        props.monthIdx.isEqual(activeMonthIdx) && {
          backgroundColor: theme['background-basic-color-3'],
        },
      ]}

      title={dateFormatter.format(props.monthIdx.date)}
      onPress={() => activateMonthIdx(props.monthIdx)}
    />
  );
}

const styles = StyleSheet.create({
  month: {
    paddingLeft: 20,
  } satisfies ViewStyle,
});
