import { type ReactNode } from 'react';
import { Link, useRouter } from 'expo-router';
import { TabScreenLayout } from '@/components/layout';
import { TopNavigationAction } from '@ui-kitten/components';
import { RecordType } from '@/enums';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { MonthRecords } from '@/components/recordsList';

export default function Records(): ReactNode {
  const router = useRouter();

  function openNewRecord(): void {
    router.push({
      pathname: '/records/new',
      params: { type: RecordType.EXPENSE },
    });
  }

  return (
    <TabScreenLayout
      title="Records"

      headerLeft={() => (
        <Link href="/records/statistics" asChild>
          <TopNavigationAction icon={iconRenderer(IconName.PIE_CHART_OUTLINE)} />
        </Link>
      )}

      headerRight={() =>
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
        />
      }
    >
      <MonthRecords />
    </TabScreenLayout>
  )
}
