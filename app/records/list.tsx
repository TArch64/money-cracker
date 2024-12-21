import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { FullScreenLayout } from '@/layout';

export default function List(): ReactNode {
  return (
    <FullScreenLayout name="records/list">
      <Text>List</Text>
    </FullScreenLayout>
  )
}
