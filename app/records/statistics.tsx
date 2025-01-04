import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';

export default function Statistics(): ReactNode {
  return (
    <FullScreenLayout title="Statistics">
      <Text>statistics</Text>
    </FullScreenLayout>
  );
}
