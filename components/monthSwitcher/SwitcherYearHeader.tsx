import type { ReactNode } from 'react';
import { ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';

export interface ISwitcherYearListProps {
  year: string;
}

export const SwitcherYearHeader = (props: ISwitcherYearListProps): ReactNode => (
  <ListItem
    disabled

    title={(txtProps) => (
      <Text {...txtProps} style={[txtProps?.style, styles.yearTitle]}>
        {props.year}
      </Text>
    )}
  />
);

const styles = StyleSheet.create({
  yearTitle: {
    fontWeight: 500,
  } satisfies TextStyle,
});
