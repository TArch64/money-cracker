import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { BudgetCard } from './BudgetCard';

export interface IBudgetUncategorizedProps {
  value: number;
}

export function BudgetUncategorized(props: IBudgetUncategorizedProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(props.value);

  return (
    <BudgetCard>
      <View style={styles.row}>
        <Text>Uncategorized</Text>
        <Text>{value}</Text>
      </View>
    </BudgetCard>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } satisfies ViewStyle,
});
