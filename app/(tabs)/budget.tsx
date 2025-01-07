import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';
import { useMonthStore } from '@/stores';

export default function Budget(): ReactNode {
  const monthIdx = useMonthStore((state) => state.activeIdx);

  return (
    <FullScreenLayout canGoBack={false} title="Budget">
      <Text>
        BUdget for {monthIdx.id}
      </Text>
    </FullScreenLayout>
  );
}
