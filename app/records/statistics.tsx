import { type ReactNode, useMemo } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { MonthIdx } from '@/components/recordsList';
import { useLocalSearchParams } from 'expo-router';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { groupBy } from 'lodash-es';
import type { Record } from '@/db';
import { StyleSheet, View, type ViewStyle } from 'react-native';

type SearchParams = {
  year: string;
  month: string;
};

function sumRecords(records: Record[]): number {
  return records.reduce((acc, record) => acc + record.value, 0);
}

interface ITotalsRowProps {
  title: string;
  value: number;
  valueStatus: 'success' | 'danger';
}

function TotalsRow(props: ITotalsRowProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const formatted = moneyFormatter.format(props.value);
  const valuePrefix = props.valueStatus === 'success' ? '' : '-';

  return (
    <View style={styles.totalsRow}>
      <Text category="s1">
        {props.title}:
      </Text>

      <Text status={props.valueStatus}>
        {valuePrefix} {formatted}
      </Text>
    </View>
  );
}

export default function Statistics(): ReactNode {
  const theme = useTheme();
  const { year, month } = useLocalSearchParams<SearchParams>();
  const monthIdx = useMemo(() => new MonthIdx(+year, +month), [year, month]);

  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const dateTitle = dateFormatter.format(monthIdx.date);

  const recordsQuery = useRecordsMonthSuspenseQuery(monthIdx.year, monthIdx.month, (records) => {
    const grouped = groupBy(records, 'type');
    const incomes = grouped.income ?? [];
    const expenses = grouped.expense ?? [];

    return {
      incomes,
      totalIncome: sumRecords(incomes),
      expenses,
      totalExpense: sumRecords(expenses),
    };
  });

  return (
    <FullScreenLayout title={`${dateTitle} Statistics`}>
      <View style={styles.column}>
        <TotalsRow
          title="Total Income"
          value={recordsQuery.data.totalIncome}
          valueStatus="success"
        />

        <TotalsRow
          title="Total Expense"
          value={recordsQuery.data.totalExpense}
          valueStatus="danger"
        />
      </View>
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

  totalsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } satisfies ViewStyle,
});
