import type { RecordWithCategory } from '@/db';
import type { ReactNode } from 'react';
import { useMonthStore } from '@/stores';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { groupBy } from 'lodash-es';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { FlashList } from '@shopify/flash-list';
import { MonthDayHeader } from './MonthDayHeader';
import { MonthRecord } from './MonthRecord';

const enum ListItemType {
  DAY_HEADER = 'day-header',
  RECORD = 'record',
}

interface IDayHeaderListItem {
  type: ListItemType.DAY_HEADER;
  date: Date;
}

interface IRecordListItem {
  type: ListItemType.RECORD;
  record: RecordWithCategory;
}

type ListItem = IDayHeaderListItem | IRecordListItem;

export function MonthRecords(): ReactNode {
  const monthIdx = useMonthStore((state) => state.activeIdx);

  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: monthIdx.year,
    month: monthIdx.month,
    subkey: ['month-records'],

    select: (records) => (
      Object.entries(groupBy(records, (record) => record.date.getDate())).flatMap(([_, records]): ListItem[] => [
        { type: ListItemType.DAY_HEADER, date: new Date(records[0].date) },
        ...records.map((record) => ({ type: ListItemType.RECORD as const, record })),
      ])
    ),
  });

  if (!recordsQuery.data.length) {
    return (
      <View style={[styles.empty]}>
        <Text>
          No records for this month
        </Text>
      </View>
    );
  }

  return (
    <FlashList
      removeClippedSubviews
      data={recordsQuery.data}
      estimatedItemSize={43.3}
      getItemType={(item) => item.type}

      renderItem={({ item }) => (
        item.type === ListItemType.DAY_HEADER
          ? <MonthDayHeader date={item.date} />
          : <MonthRecord record={item.record} />
      )}

      overrideItemLayout={(layout, item) => {
        if (item.type === ListItemType.DAY_HEADER) {
          layout.size = 22.3;
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  empty: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,
});
