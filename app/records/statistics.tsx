import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { MonthIdx } from '@/components/recordsList';
import { useLocalSearchParams } from 'expo-router';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { RecordType } from '@/enums';
import { groupBy } from 'lodash-es';
import { Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Record } from '@/db';

type SearchParams = {
  year: string;
  month: string;
};

interface IWrapperProps extends PropsWithChildren {
  monthIdx: MonthIdx;
}

function Wrapper(props: IWrapperProps): ReactNode {
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const dateTitle = dateFormatter.format(props.monthIdx.date);

  return (
    <FullScreenLayout title={`${dateTitle} Statistics`}>
      {props.children}
    </FullScreenLayout>
  );
}

function sumRecords(records: Record[]): number {
  return records.reduce((acc, record) => acc + record.value, 0);
}

export default function Statistics(): ReactNode {
  const { year, month } = useLocalSearchParams<SearchParams>();
  const monthIdx = useMemo(() => new MonthIdx(+year, +month), [year, month]);

  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: monthIdx.year,
    month: monthIdx.month,
    subkey: ['statistics'],

    filter: {
      type: RecordType.EXPENSE,
    },

    select(records) {
      return {
        categoriesPie: Object.entries(groupBy(records, 'category.name')).map(([name, records]) => ({
          x: name,
          y: sumRecords(records),
        })),

        total: sumRecords(records),
      };
    },
  });

  const moneyFormatter = useMoneyFormatter();
  const total = moneyFormatter.format(recordsQuery.data.total);

  if (!recordsQuery.data.total) {
    return (
      <Wrapper monthIdx={monthIdx}>
        <SafeAreaView style={[styles.column, styles.emptyColumn]} edges={['bottom']}>
          <Text>
            No expenses recorded yet
          </Text>
        </SafeAreaView>
      </Wrapper>
    );
  }

  return (
    <Wrapper monthIdx={monthIdx}>
      <View style={styles.column}>
        <View style={styles.totalsRow}>
          <Text category="s1">
            Total Expenses
          </Text>

          <Text status="danger">
            - {total}
          </Text>
        </View>
      </View>
    </Wrapper>
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

  totalsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } satisfies ViewStyle,
});
