import { Fragment, type ReactNode } from 'react';
import type { MonthIdx } from './MonthIdx';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { Divider, Text, useTheme } from '@ui-kitten/components';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { MonthRecord } from './MonthRecord';

export interface IMonthRecordsProps {
  idx: MonthIdx;
}

export function MonthRecords(props: IMonthRecordsProps): ReactNode {
  const recordsQuery = useRecordsMonthSuspenseQuery(props.idx.year, props.idx.month);
  const theme = useTheme();

  const dividerStyles: ViewStyle = {
    backgroundColor: theme['color-basic-400'],
  };

  if (!recordsQuery.data.length) {
    return (
      <View style={[styles.wrapper, styles.empty]}>
        <Text>
          No records for this month
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView style={styles.wrapper}>
        {recordsQuery.data.map((record, index) => (
          <Fragment key={record.id}>
            {index > 0 && <Divider style={[styles.divider, dividerStyles]} />}
            <MonthRecord record={record} />
          </Fragment>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
  } satisfies ViewStyle,

  empty: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,

  divider: {
    marginLeft: 8,
    marginRight: 12,
  } satisfies ViewStyle,
});
