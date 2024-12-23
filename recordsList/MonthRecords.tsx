import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { MonthIndex } from './MonthIndex';

export interface IMonthRecordsProps {
  idx: MonthIndex;
}

export function MonthRecords(props: IMonthRecordsProps): ReactNode {
  return (
    <Text>
      {props.idx.year}-{props.idx.month}
    </Text>
  );
}
