import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { RecordType } from '@/enums';
import { TopNavigationAction } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { CategoriesList } from '@/components/categoriesList';

export default function Index(): ReactNode {
  const router = useRouter();
  const [type, setType] = useState(RecordType.EXPENSE);

  function openCreate() {
    router.push({
      pathname: '/categories/new',
      params: { type },
    });
  }

  return (
    <FullScreenLayout
      title="Categories"

      headerRight={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openCreate}
        />
      )}
    >
      <CategoriesList
        type={type}
        onTypeChange={setType}
      />
    </FullScreenLayout>
  );
}
