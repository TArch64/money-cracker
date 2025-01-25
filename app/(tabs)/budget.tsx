import { type ReactNode, useCallback } from 'react';
import { TabScreenLayout } from '@/components/layout';
import { useMonthStore } from '@/stores';
import { useBudgetMonthQuery } from '@/hooks/queries';
import { TopNavigationAction } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { BudgetEmpty, BudgetMonth } from '@/components/budget';

export default function Budget(): ReactNode {
  const router = useRouter();
  const monthIdx = useMonthStore((state) => state.activeIdx);
  const budget = useBudgetMonthQuery(monthIdx.year, monthIdx.month);

  const openEdit = useCallback((): void => {
    router.push({
      pathname: '/budgets/[budgetId]/edit',
      params: { budgetId: budget.data!.id },
    });
  }, [budget.data?.id]);

  return (
    <TabScreenLayout
      title="Budget"

      headerRight={budget.data ? () => (
        <TopNavigationAction
          icon={iconRenderer(IconName.EDIT_OUTLINE)}
          onPress={openEdit}
        />
      ) : undefined}
    >
      {budget.isLoading
        ? null
        : budget.data?.categories?.length || budget.data?.uncategorized
          ? <BudgetMonth budget={budget.data} />
          : <BudgetEmpty />}
    </TabScreenLayout>
  );
}
