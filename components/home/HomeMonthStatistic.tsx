import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { HomeCard } from './HomeCard';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { useRecordsMonthStatisticsSuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { getRecordTypeTitle, RecordType } from '@/enums';
import { useMoneyFormatter } from '@/hooks/formatters';
import { Icon, IconName } from '@/components/uiKitten';

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
    <View style={styles.dataColumn}>
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
      <View style={styles.titleRow}>
        <Text category="h3">
          Month Statistics
        </Text>

        {hasData && (
          <Icon
            name={IconName.CHEVRON_RIGHT}
            style={styles.titleIcon}
          />
        )}
      </View>

      {hasData ? (
        <View style={styles.dataRow}>
          {data.map((item) => (
            <StatisticColumn key={item.type} type={item.type} total={item.total} />
          ))}
        </View>
      ) : (
        <Text category="c1">
          No records for this month
        </Text>
      )}
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  } satisfies TextStyle,

  titleIcon: {
    width: 22,
    height: 22,
  } satisfies ViewStyle,

  dataRow: {
    display: 'flex',
    flexDirection: 'row',
  } satisfies ViewStyle,

  dataColumn: {
    flexBasis: 0,
    flexGrow: 1,
  } satisfies ViewStyle,
});
