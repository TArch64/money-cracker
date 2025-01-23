import type { ReactNode } from 'react';
import { Divider, Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter } from '@/hooks/formatters';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';

interface IMonthDayHeaderProps {
  date: Date;
}

export function MonthDayHeader(props: IMonthDayHeaderProps): ReactNode {
  const theme = useTheme();
  const dateFormatter = useDateFormatter({ month: 'long', day: 'numeric' });
  const date = dateFormatter.format(props.date);

  const dividerStyle: ViewStyle = {
    backgroundColor: theme['color-basic-500'],
  };

  return (
    <View style={styles.row}>
      <Divider style={[styles.divider, dividerStyle]} />

      <Text
        category="label"

        style={[
          styles.title,
          { color: theme['color-basic-700'] },
        ] satisfies StyleProp<TextStyle>}
      >
        {date}
      </Text>

      <Divider style={[styles.divider, dividerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  } satisfies ViewStyle,

  divider: {
    flexBasis: 0,
    flexGrow: 1,
  } satisfies ViewStyle,

  title: {
    fontWeight: 600,
  } satisfies TextStyle,
});
