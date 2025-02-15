import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type TextStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBalanceSuspenseQuery } from '@/hooks/queries';
import { useMoneyFormatter } from '@/hooks/formatters';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { HomeCard } from './HomeCard';

export function HomeBalance(): ReactNode {
  const { t } = useTranslation();
  const balanceQuery = useBalanceSuspenseQuery();
  const moneyFormatter = useMoneyFormatter();
  const status = balanceQuery.data.balance >= 0 ? 'basic' : 'danger';
  const value = moneyFormatter.format(balanceQuery.data.balance);

  return (
    <HomeCard>
      <Text style={styles.title}>
        {t('home.sections.balance.title')}
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
