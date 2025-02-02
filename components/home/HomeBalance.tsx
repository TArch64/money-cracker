import type { ReactNode } from 'react';
import { Card, Text } from '@ui-kitten/components';
import { useBalanceSuspenseQuery } from '@/hooks/queries';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';

export function HomeBalance(): ReactNode {
  const balanceQuery = useBalanceSuspenseQuery();
  const moneyFormatter = useMoneyFormatter();
  const status = balanceQuery.data.balance >= 0 ? 'basic' : 'danger';
  const value = moneyFormatter.format(balanceQuery.data.balance);

  return (
    <Card disabled style={styles.card}>
      <Text style={styles.title}>
        Total Balance
      </Text>

      <Text category="h2" status={status}>
        {value}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  } satisfies ViewStyle,

  title: {
    marginBottom: 4,
  } satisfies TextStyle,
});
