import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/layout';
import { Text } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { RecordType } from '@/db';

export default function New(): ReactNode {
  const { type } = useLocalSearchParams<{ type: RecordType }>();

  return (
    <FullScreenLayout>
      <Text>New {type}</Text>
    </FullScreenLayout>
  )
}
