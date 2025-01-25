import type { ReactNode } from 'react';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { BudgetCard } from './BudgetCard';
import type { IPropsWithStyle } from '@/types';

export interface IBudgetAvailableMoneyProps extends IPropsWithStyle<ViewStyle> {
  value: number;
}

export function BudgetAvailableMoney(props: IBudgetAvailableMoneyProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(props.value);
  const status = props.value >= 0 ? 'basic' : 'danger';

  return (
    <BudgetCard style={props.style}>
      <View style={styles.row}>
        <Text category="s1">Available Money</Text>
        <Text status={status}>{value}</Text>
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
