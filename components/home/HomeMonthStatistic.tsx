import type { ReactNode } from 'react';
import { Text, useTheme } from '@ui-kitten/components';
import { HomeCard } from './HomeCard';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { useRecordsMonthSummarySuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { getRecordTypeTitle, isExpenseRecord, RecordType } from '@/enums';
import { useMoneyFormatter } from '@/hooks/formatters';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { useTranslation } from 'react-i18next';

interface IStatisticColumnProps {
  type: RecordType;
  total: number;
}

function StatisticColumn(props: IStatisticColumnProps): ReactNode {
  const { t } = useTranslation();
  const theme = useTheme();
  const moneyFormatter = useMoneyFormatter();
  const status = props.type === RecordType.INCOME ? 'success' : 'danger';
  const title = getRecordTypeTitle(t, props.type);
  const value = moneyFormatter.format(props.total);

  const textStyle: TextStyle = {
    color: theme[`color-${status}-600`],
  };

  return (
    <View
      style={[
        styles.dataColumn,
        isExpenseRecord(props.type) && styles.dataColumnRight,
      ]}
    >
      <Text style={textStyle}>
        {`${title}: `}

        <Text category="s1" style={textStyle}>
          {value}
        </Text>
      </Text>
    </View>
  );
}

export function HomeMonthStatistic(): ReactNode {
  const { t } = useTranslation();
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const statisticsQuery = useRecordsMonthSummarySuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  if (!statisticsQuery.data.expenseTotal) {
    return null;
  }

  return (
    <HomeCard href="/month/statistics">
      <HomeCardTitle
        linked
        style={styles.title}
        title={t('home.sections.monthStatistics.title')}
      />

      <View style={styles.dataRow}>
        <StatisticColumn
          type={RecordType.INCOME}
          total={statisticsQuery.data.incomeTotal}
        />

        <StatisticColumn
          type={RecordType.EXPENSE}
          total={statisticsQuery.data.expenseTotal}
        />
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 6,
  } satisfies ViewStyle,

  dataRow: {
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
