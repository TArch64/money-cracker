import type { ReactNode } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { useMonthStore } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { Text } from '@ui-kitten/components';

export default function Budget(): ReactNode {
  const monthIdx = useMonthStore((state) => state.activeIdx);
  const budget = useBudgetMonthSuspenseQuery(monthIdx.year, monthIdx.month);

  return (
    <TabScreenLayout title="Budget">
      <Text>
        1231
      </Text>
    </TabScreenLayout>
  );
}
