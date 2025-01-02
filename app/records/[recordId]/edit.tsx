import type { ReactNode } from 'react';
import { MainScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { useRecordDetailsSuspenseQuery } from '@/hooks/queries';
import { getRecordTypeTitle } from '@/enums';

export default function Edit(): ReactNode {
  const { recordId: recordId_ } = useLocalSearchParams<{ recordId: string }>();
  const recordId = +recordId_;
  const record = useRecordDetailsSuspenseQuery(recordId);

  return (
    <MainScreenLayout title={`Edit ${getRecordTypeTitle(record.data.type)}`}>
      <Text>Edit Record</Text>
    </MainScreenLayout>
  )
}
