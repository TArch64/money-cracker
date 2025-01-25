import { MonthIdx, useMonthStore } from '@/stores';
import { type ReactNode, useMemo } from 'react';
import { useDateFormatter } from '@/hooks/formatters';
import { ListItem, Text, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
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

      title={(txtProps) => (
        <Text
          {...txtProps}

          style={[
            txtProps?.style,
            isCurrentMonth && { color: theme['color-primary-500'] },
          ] satisfies StyleProp<TextStyle>}
        >
          {dateFormatter.format(props.monthIdx.date)}
        </Text>
      )}

      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  month: {
    paddingLeft: 16,
    marginHorizontal: 4,
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
