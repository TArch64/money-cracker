import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { useBalanceSuspenseQuery } from '@/hooks/queries';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, type TextStyle } from 'react-native';
import { HomeCard } from './HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';

export function HomeBalance(): ReactNode {
  const balanceQuery = useBalanceSuspenseQuery();
  const moneyFormatter = useMoneyFormatter();
  const status = balanceQuery.data.balance >= 0 ? 'basic' : 'danger';
  const value = moneyFormatter.format(balanceQuery.data.balance);

  return (
    <HomeCard>
      <Text style={styles.title}>
        Current Balance
      </Text>

      <HomeCardTitle
        status={status}
        title={value}
      />
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
  } satisfies TextStyle,
});
