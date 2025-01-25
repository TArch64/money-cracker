import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { useMoneyFormatter } from '@/hooks/formatters';
import { useMonthStore } from '@/stores';
import { useRecordsMonthStatisticsSuspenseQuery } from '@/hooks/queries';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';

interface IDataRowProps {
  label: string;
  labelCategory?: 's1' | 'p1';
  value: number;
}

function DataRow(props: IDataRowProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(props.value);

  return (
    <View style={styles.dataRow}>
      <Text category={props.labelCategory ?? 'p1'}>
        {props.label}
      </Text>

      <Text status="danger">
        - {value}
      </Text>
    </View>
  );
}

function MonthStatistics(): ReactNode {
  const monthIdx = useMonthStore((state) => state.activeIdx);
  const expensesQuery = useRecordsMonthStatisticsSuspenseQuery(monthIdx.year, monthIdx.month);

  if (!expensesQuery.data.hasExpenses) {
    return (
      <SafeAreaView style={[styles.column, styles.emptyColumn]} edges={['bottom']}>
        <Text>
          No expenses recorded yet
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.column}>
      <DataRow
        label="Total Expenses"
        labelCategory="s1"
        value={expensesQuery.data.expenseTotal}
      />

      {expensesQuery.data.expenseCategories.map((category) => (
        <DataRow
          key={category.id}
          label={category.name}
          value={category.total}
        />
      ))}
    </ScrollView>
  )
}

export default function Statistics(): ReactNode {
  return (
    <FullScreenLayout title="Statistics">
      <MonthStatistics />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingTop: 12,
    paddingHorizontal: 20,
  } satisfies ViewStyle,

  emptyColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  } satisfies ViewStyle,

  dataRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } satisfies ViewStyle,
});
