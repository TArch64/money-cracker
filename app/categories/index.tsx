import { type ReactNode, useMemo, useState } from 'react';
import { TopNavigationAction } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { FullScreenLayout } from '@/components/layout';
import { getRecordTypeTitle, RecordType } from '@/enums';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { CategoriesList } from '@/components/categoriesList';
import { ButtonSelect } from '@/components/ButtonSelect';

export default function Index(): ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
  const [type, setType] = useState(RecordType.EXPENSE);

  function openCreate() {
    router.push({
      pathname: '/categories/new',
      params: { type },
    });
  }

  const recordTypeOptions = useMemo(() => {
    return [RecordType.EXPENSE, RecordType.INCOME].map((value) => ({
      value,
      label: getRecordTypeTitle(t, value),
    }));
  }, []);

  return (
    <FullScreenLayout
      title={t('categories.index.title')}

      headerRight={() => (
        <TopNavigationAction
          icon={iconRenderer(IconName.PLUS)}
          onPress={openCreate}
        />
      )}
    >
      <CategoriesList
        type={type}

        header={(
          <ButtonSelect
            value={type}
            onChange={setType}
            options={recordTypeOptions}
            style={styles.typeSelector}
          />
        )}
      />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    marginVertical: 16,
    marginHorizontal: 16,
  } satisfies ViewStyle,
});
