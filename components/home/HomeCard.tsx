import type { ReactNode } from 'react';
import { Card, type CardProps } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';

export interface IHomeCardProps extends CardProps {
}

export const HomeCard = (props: IHomeCardProps): ReactNode => (
  <Card
    {...props}
    style={[styles.card, props.style]}
    disabled={props.disabled || !props.onPress}
  />
);

const styles = StyleSheet.create({
  card: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
