import { Fragment, type ReactNode } from 'react';
import type { MonthIdx } from './MonthIdx';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { Divider, useTheme } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordsMonthQuery } from '@/queries';
import { MonthRecord } from '@/recordsList/MonthRecord';

export interface IMonthRecordsProps {
  idx: MonthIdx;
}

export function MonthRecords(props: IMonthRecordsProps): ReactNode {
  const recordsQuery = useRecordsMonthQuery(props.idx.year, props.idx.month);
  const theme = useTheme();

  const dividerStyles: ViewStyle = {
    backgroundColor: theme['color-basic-400'],
  };

  return (
    <SafeAreaView
      edges={['bottom']}
      style={styles.wrapper}
    >
      <ScrollView style={styles.wrapper}>
        {recordsQuery.data.map((record, index) => (
          <Fragment key={record.id}>
            {index > 0 && <Divider style={[styles.divider, dividerStyles]} />}
            <MonthRecord record={record} />
          </Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: '100%',
    width: '100%',
  } satisfies ViewStyle,

  divider: {
    marginLeft: 8,
    marginRight: 12,
  } satisfies ViewStyle,
});
