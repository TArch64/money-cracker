import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';

export default function Budget(): ReactNode {
  return (
    <FullScreenLayout canGoBack={false} title="Budget">
      <Text>BUdget</Text>
    </FullScreenLayout>
  );
}
