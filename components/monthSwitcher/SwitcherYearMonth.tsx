import { MonthIdx, useMonthStore } from '@/stores';
import { type ReactNode, useMemo } from 'react';
import { useDateFormatter } from '@/hooks/formatters';
import { ListItem, useTheme } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { textRenderer } from '@/components/uiKitten';

export interface ISwitcherMonthYearProps {
  monthIdx: MonthIdx;
}

export function SwitcherYearMonth(props: ISwitcherMonthYearProps): ReactNode {
  const router = useRouter();
  const theme = useTheme();
  const dateFormatter = useDateFormatter({ month: 'long' });
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const activateMonthIdx = useMonthStore((state) => state.activateIdx);
  const isCurrentMonth = useMemo(() => props.monthIdx.isEqual(MonthIdx.current()), [props.monthIdx.id]);

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

      title={textRenderer(dateFormatter.format(props.monthIdx.date), {
        style: isCurrentMonth && { color: theme['color-primary-500'] },
      })}

      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  month: {
    paddingLeft: 8,
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 8,
    overflow: 'hidden',
  } satisfies ViewStyle,

  currentMonth: {
    left: 4,
    width: 3,
    height: 30,
    borderRadius: 2,
    position: 'absolute',
  } satisfies ViewStyle,
});
