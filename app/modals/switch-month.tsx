import { type ReactNode, Suspense } from 'react';
import { TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { SwitcherYearList } from '@/components/layout/tab';
import { useRouter } from 'expo-router';

export default function SwitchMonth(): ReactNode {
  const router = useRouter();

  return (
    <>
      <TopNavigation
        title="Select Month"
        alignment="center"

        accessoryLeft={() => (
          <TopNavigationAction
            icon={iconRenderer(IconName.ARROW_BACK)}
            onPress={() => router.back()}
          />
        )}
      />
      <Suspense>
        <SwitcherYearList />
      </Suspense>
    </>
  );
}
