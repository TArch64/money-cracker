import type { ReactNode } from 'react';
import { Divider, List, ListItem, Text } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FullScreenLayout } from '@/components/layout';
import { type IRecordMonthStatistics, useRecordsMonthStatisticsSuspenseQuery } from '@/hooks/queries';
import { useMonthStore } from '@/stores';
import { useMoneyFormatter } from '@/hooks/formatters';

interface IMonthCategoryStatisticsProps {
  category: IRecordMonthStatistics;
}

function MonthCategoryStatistics(props: IMonthCategoryStatisticsProps) {
  const moneyFormatter = useMoneyFormatter();

  return (
    <ListItem
      disabled
      title={props.category.categoryName}

      accessoryRight={() => (
        <Text>
          {moneyFormatter.format(props.category.total)}
        </Text>
      )}
    />
  );
}

function MonthStatistics(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const statisticsQuery = useRecordsMonthStatisticsSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);

  return (
    <List
      style={styles.list}
      data={statisticsQuery.data}
      keyExtractor={(item) => item.categoryId.toString()}
      renderItem={({ item }) => <MonthCategoryStatistics category={item} />}

      ItemSeparatorComponent={() => (
        <Divider style={styles.listDivider} />
      )}
    />
  );
}

export default function Statistics(): ReactNode {
  const { t } = useTranslation();

  return (
    <FullScreenLayout title={t('monthStatistics.title')}>
      <MonthStatistics />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 8,
  } satisfies ViewStyle,

  listDivider: {
    marginHorizontal: 6,
  } satisfies ViewStyle,
});
