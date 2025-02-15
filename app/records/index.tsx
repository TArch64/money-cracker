import { type ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { TopNavigationAction } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { FullScreenLayout } from '@/components/layout';
import { RecordType } from '@/enums';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { MonthRecords } from '@/components/recordsList';

export default function Index(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();

  function openNewRecord(): void {
    router.push({
      pathname: '/records/new',
      params: { type: RecordType.EXPENSE },
    });
  }

  return (
    <FullScreenLayout
      title={t('records.index.title')}

      headerRight={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openNewRecord}
        />
      )}
    >
      <MonthRecords />
    </FullScreenLayout>
  );
}
