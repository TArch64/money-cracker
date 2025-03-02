import { type ReactNode, useMemo } from 'react';
import { Card, type CardProps } from '@ui-kitten/components';
import { StyleSheet } from 'react-native';
import { type Href, useRouter } from 'expo-router';
import { maybeFn, type MaybeFn } from '@/helpers/maybeFn';

export interface IHomeCardProps extends Omit<CardProps, 'onPress'> {
  href?: MaybeFn<Href>;
  padding?: boolean;
  onPress?: () => void;
}

export function HomeCard(props: IHomeCardProps): ReactNode {
  const router = useRouter();

  const onPress = useMemo(() => {
    if (props.onPress) return props.onPress;
    if (props.href) return () => router.push(maybeFn(props.href)!);
  }, [props.onPress, props.href]);

  return (
    <Card
      {...props}
      style={[props.padding !== false && styles.cardPadding, props.style]}
      disabled={props.disabled || !onPress}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  cardPadding: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
});
