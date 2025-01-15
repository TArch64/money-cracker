import { MonthIdx } from '@/stores';
import type { ReactNode } from 'react';
import { List, ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';
import { SwitcherMonth } from './SwitcherMonth';

export interface ISwitcherMonthListProps {
  year: string;
  months: MonthIdx[];
}

export function SwitcherMonthList(props: ISwitcherMonthListProps): ReactNode {
  return (
    <>
      <ListItem
        disabled
        title={(txtProps) => (
          <Text {...txtProps} style={[txtProps?.style, styles.yearTitle]}>
            {props.year}
          </Text>
        )}
      />

      <List
        data={props.months}
        renderItem={({ item }) => <SwitcherMonth monthIdx={item} />}
      />
    </>
  );
}

const styles = StyleSheet.create({
  yearTitle: {
    fontWeight: 500,
  } satisfies TextStyle,
});
