import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { useMoneyFormatter } from '@/hooks/formatters';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface IBudgetOtherProps {
  value: number;
}

export function BudgetOther(props: IBudgetOtherProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(props.value);

  return (
    <View style={styles.row}>
      <Text>Uncategorized</Text>
      <Text>{value}</Text>
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
