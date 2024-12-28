import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import type { MonthIdx } from './MonthIdx';
import { View, type ViewStyle } from 'react-native';

export interface IMonthRecordsProps {
  idx: MonthIdx;
}

export function MonthRecords(props: IMonthRecordsProps): ReactNode {
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      } satisfies ViewStyle}
    >
      <Text>
        {props.idx.year}-{props.idx.month}
      </Text>
    </View>
  );
}
