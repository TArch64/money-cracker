import type { ReactNode } from 'react';
import type { MonthIdx } from './MonthIdx';
import { StyleSheet, type ViewStyle } from 'react-native';
import { Text } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecordsMonthQuery } from '@/queries';

export interface IMonthRecordsProps {
  idx: MonthIdx;
}

export function MonthRecords(props: IMonthRecordsProps): ReactNode {
  const recordsQuery = useRecordsMonthQuery(props.idx.year, props.idx.month);

  return (
    <SafeAreaView
      edges={['bottom']}
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      } satisfies ViewStyle}
    >
      <Text>
        {JSON.stringify(recordsQuery.data, null, 2)}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: '100%',
    width: '100%',
  } satisfies ViewStyle,
});
