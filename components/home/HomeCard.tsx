import type { ReactNode } from 'react';
import { Card, type CardProps } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { maybeFn, type MaybeFn } from '@/helpers/maybeFn';

export interface IHomeCardProps extends Omit<CardProps, 'onPress'> {
  href?: MaybeFn<Href>;
  padding?: boolean;
}

export function HomeCard(props: IHomeCardProps): ReactNode {
  const router = useRouter();

  return (
    <Card
      {...props}
      style={[props.padding !== false && styles.cardPadding, props.style]}
      disabled={props.disabled || !props.href}
      onPress={props.href ? () => router.push(maybeFn(props.href)!) : undefined}
    />
  );
}

const styles = StyleSheet.create({
  cardPadding: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
