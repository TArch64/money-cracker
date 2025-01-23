import { MonthIdx, useMonthStore } from '@/stores';
import type { ReactNode } from 'react';
import { useDateFormatter } from '@/hooks/formatters';
import { ListItem, useTheme } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';

export interface ISwitcherMonthYearProps {
  monthIdx: MonthIdx;
}

export function SwitcherYearMonth(props: ISwitcherMonthYearProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();
  const dateFormatter = useDateFormatter({ month: 'long' });
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const activateMonthIdx = useMonthStore((state) => state.activateIdx);

  function onPress(): void {
    activateMonthIdx(props.monthIdx);
    router.back();
  }

  return (
    <ListItem
      style={[
        styles.month,

        props.monthIdx.isEqual(activeMonthIdx) && {
          backgroundColor: theme['background-basic-color-3'],
        },
      ]}

      title={dateFormatter.format(props.monthIdx.date)}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  month: {
    paddingLeft: 20,
  } satisfies ViewStyle,
});
