import type { ReactNode } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';

export default function Budget(): ReactNode {
  return (
    <TabScreenLayout title="Budget">
      {(monthIdx) => (
        <Text>
          BUdget for {monthIdx.id}
        </Text>
      )}
    </TabScreenLayout>
  );
}
