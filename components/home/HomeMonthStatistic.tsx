import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { HomeCard } from './HomeCard';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { useRecordsMonthStatisticsSuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { getRecordTypeTitle, isExpenseRecord, RecordType } from '@/enums';
import { useMoneyFormatter } from '@/hooks/formatters';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';

interface IStatisticColumnProps {
  type: RecordType,
  total: number,
}

function StatisticColumn(props: IStatisticColumnProps): ReactNode {
  const moneyFormatter = useMoneyFormatter();
  const status = props.type === RecordType.INCOME ? 'success' : 'danger';
  const title = getRecordTypeTitle(props.type);
  const value = moneyFormatter.format(props.total);

  return (
    <View
      style={[
        styles.dataColumn,
        isExpenseRecord(props.type) && styles.dataColumnRight,
      ]}
    >
      <Text status={status}>
        {title}
        {': '}
        <Text category="s1" status={status}>{value}</Text>
      </Text>
    </View>
  );
}

export function HomeMonthStatistic(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const statisticsQuery = useRecordsMonthStatisticsSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  const data = [
    { type: RecordType.INCOME, total: statisticsQuery.data.incomeTotal },
    { type: RecordType.EXPENSE, total: statisticsQuery.data.expenseTotal },
  ];

  const hasData = data.some((item) => item.total > 0);

  return (
    <HomeCard disabled={!hasData} href="/month/statistics">
      <HomeCardTitle
        linked={hasData}
        title="Month Statistics"
      />

      {hasData ? (
        <View style={styles.dataRow}>
          {data.map((item) => (
            <StatisticColumn key={item.type} type={item.type} total={item.total} />
          ))}
        </View>
      ) : (
        <Text category="c1" style={styles.emptyText}>
          No records for this month
        </Text>
      )}
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  emptyText: {
    marginTop: 4,
  } satisfies TextStyle,

  dataRow: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
  } satisfies ViewStyle,

  dataColumn: {
    flexBasis: 0,
    flexGrow: 1,
  } satisfies ViewStyle,

  dataColumnRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } satisfies ViewStyle,
});
