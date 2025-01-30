import type { ReactNode } from 'react';
import { ListItem } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';
import { textRenderer } from '@/components/uiKitten';

export interface ISwitcherYearListProps {
  year: string;
}

export const SwitcherYearHeader = (props: ISwitcherYearListProps): ReactNode => (
  <ListItem
    disabled
    title={textRenderer(props.year, { style: styles.yearTitle })}
  />
);

const styles = StyleSheet.create({
  yearTitle: {
    fontWeight: 500,
  } satisfies TextStyle,
});
