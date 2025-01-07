import type { ReactNode } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { MonthIdx } from '@/stores';
import { useBudgetMonthSuspenseQuery } from '@/hooks/queries';
import { Text } from '@ui-kitten/components';

interface IMonthBudgetProps {
  monthIdx: MonthIdx;
}

function MonthBudget(props: IMonthBudgetProps): ReactNode {
  const budget = useBudgetMonthSuspenseQuery(props.monthIdx.year, props.monthIdx.month);

  return (
    <Text>
      {JSON.stringify(budget.data, null, 2)}
    </Text>
  );
}

export default function Budget(): ReactNode {
  return (
    <TabScreenLayout title="Budget">
      {(monthIdx) => <MonthBudget monthIdx={monthIdx} />}
    </TabScreenLayout>
  );
}
