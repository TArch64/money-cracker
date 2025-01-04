import { type ReactNode, useMemo } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { MonthIdx } from '@/components/recordsList';
import { useLocalSearchParams } from 'expo-router';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { RecordType } from '@/enums';
import { groupBy } from 'lodash-es';
import { Text } from '@ui-kitten/components';

type SearchParams = {
  year: string;
  month: string;
};

export default function Statistics(): ReactNode {
  const { year, month } = useLocalSearchParams<SearchParams>();
  const monthIdx = useMemo(() => new MonthIdx(+year, +month), [year, month]);

  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const dateTitle = dateFormatter.format(monthIdx.date);

  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: monthIdx.year,
    month: monthIdx.month,
    subkey: ['statistics'],

    filter: {
      type: RecordType.EXPENSE,
    },

    select: (records) => ({
      categories: groupBy(records, 'category.name'),
      total: records.reduce((acc, record) => acc + record.value, 0),
    }),
  });

  const moneyFormatter = useMoneyFormatter();
  const total = moneyFormatter.format(recordsQuery.data.total);

  return (
    <FullScreenLayout title={`${dateTitle} Statistics`}>
      <View style={styles.column}>
        <View style={styles.totalsRow}>
          <Text category="s1">
            Total Expenses
          </Text>

          {recordsQuery.data.total ? (
            <Text status="danger">
              - {total}
            </Text>
          ) : (
            <Text>
              None
            </Text>
          )}
        </View>
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
