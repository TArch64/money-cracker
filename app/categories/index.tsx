import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { RecordType } from '@/enums';
import { TopNavigationAction } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { CategoriesList } from '@/components/categoriesList';
import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { StyleSheet, type ViewStyle } from 'react-native';

const recordTypeOptions: IButtonSelectOption<RecordType>[] = [
  {
    value: RecordType.EXPENSE,
    label: 'Expense',
  },
  {
    value: RecordType.INCOME,
    label: 'Income',
  },
];

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

        header={
          <ButtonSelect
            value={type}
            onChange={setType}
            options={recordTypeOptions}
            style={styles.typeSelector}
          />
        }
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
