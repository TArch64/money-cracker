import type { ReactNode } from 'react';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';

export interface IBudgetAvailableMoneyProps {
  value: number;
}

export function BudgetAvailableMoney(props: IBudgetAvailableMoneyProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(props.value);
  const status = props.value > 0 ? 'basic' : 'danger';

  return (
    <View style={styles.row}>
      <Text>Available Money</Text>
      <Text status={status}>{value}</Text>
    </View>
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
