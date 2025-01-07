import type { ReactNode } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { useMoneyFormatter } from '@/hooks/formatters';
import { MonthIdx } from '@/stores';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { RecordType } from '@/enums';
import { groupBy } from 'lodash-es';
import { Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Record } from '@/db';

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

function sumRecords(records: Record[]): number {
  return records.reduce((acc, record) => acc + record.value, 0);
}

interface IMonthStatisticsProps {
  monthIdx: MonthIdx;
}

function MonthStatistics(props: IMonthStatisticsProps): ReactNode {
  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: props.monthIdx.year,
    month: props.monthIdx.month,
    subkey: ['statistics'],

    filter: {
      type: RecordType.EXPENSE,
    },

    select: (records) => ({
      total: sumRecords(records),

      categories: Object
        .entries(groupBy(records, 'category.name'))
        .map(([name, records]) => ({ name, value: sumRecords(records) }))
        .sort((c1, c2) => c2.value - c1.value),
    }),
  });

  if (!recordsQuery.data.total) {
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
        value={recordsQuery.data.total}
      />

      {recordsQuery.data.categories.map((category) => (
        <DataRow
          key={category.name}
          label={category.name}
          value={category.value}
        />
      ))}
    </ScrollView>
  )
}

export default function Statistics(): ReactNode {
  return (
    <TabScreenLayout>
      {(monthIdx) => <MonthStatistics monthIdx={monthIdx} />}
    </TabScreenLayout>
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
