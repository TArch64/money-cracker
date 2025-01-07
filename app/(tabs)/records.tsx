import { type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { TabScreenLayout } from '@/components/layout';
import { MonthRecords } from '@/components/recordsList';
import { TopNavigationAction } from '@ui-kitten/components';
import { RecordType } from '@/enums';
import { IconName, iconRenderer } from '@/components/uiKitten/Icon';

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
      headerRight={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
        />
      )}
    >
      {(idx) => <MonthRecords idx={idx} />}
    </TabScreenLayout>
  )
}
