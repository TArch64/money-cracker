import { Card, type CardProps } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export const BudgetCard = ({ children, style, ...props }: Omit<CardProps, 'disabled' | 'onPress'>): ReactNode => (
  <Card {...props} disabled style={[style, styles.card]}>
    <View style={styles.inner}>
      {children}
    </View>
  </Card>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
  } satisfies ViewStyle,

  inner: {
    marginVertical: -4,
    marginHorizontal: -10,
  } satisfies ViewStyle,
});
