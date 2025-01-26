import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { type CategoryWithUsage, useCategoriesListWithUsageQuery, useCategoryDeleteMutation } from '@/hooks/queries';
import { useActionSheet } from '@/hooks/useActionSheet';
import { RecordType } from '@/enums';
import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { List, ListItem, Text, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { showConfirm } from '@/helpers/showConfirm';

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

const ListEmpty = (): ReactNode => (
  <View style={styles.listEmpty}>
    <Text>
      There is no categories of this type yet
    </Text>
  </View>
);

interface ICategoryListItemProps {
  category: CategoryWithUsage;
}

function CategoryListItem(props: ICategoryListItemProps): ReactNode {
  const deleteMutation = useCategoryDeleteMutation();

  function isDeleteConfirmed() {
    return showConfirm({
      title: 'Delete Category',
      message: `Are you sure you want to delete "${props.category.name}" category?`,

      accept: {
        text: 'Delete',
        style: 'destructive',
      },
    });
  }

  const showActionsSheet = useActionSheet(() => [
    {
      text: 'Rename',
      onPress: () => 0,
    },
    {
      text: 'Delete',
      style: 'destructive',

      onPress: async () => {
        if (props.category.budgetExists || props.category.recordExists) {
          return;
        }

        if (!await isDeleteConfirmed()) {
          return;
        }

        await deleteMutation.mutateAsync({
          id: props.category.id,
          type: props.category.type,
        });
      },
    },
    {
      text: 'Cancel',
      style: 'cancel',
    },
  ]);

  return (
    <ListItem
      title={props.category.name}
      style={styles.listItem}
      onPress={showActionsSheet}
    />
  );
}

function CategoriesList(): ReactNode {
  const theme = useTheme();
  const [type, setType] = useState(RecordType.EXPENSE);
  const categoriesQuery = useCategoriesListWithUsageQuery(type);

  return (
    <List
      removeClippedSubviews
      data={categoriesQuery.data}

      style={[
        { backgroundColor: theme['background-basic-color-1'] },
      ] satisfies StyleProp<ViewStyle>}

      renderItem={({ item }) => <CategoryListItem category={item} />}

      ListHeaderComponent={
        <ButtonSelect
          value={type}
          onChange={setType}
          options={recordTypeOptions}
          style={styles.typeSelector}
        />
      }

      ListEmptyComponent={ListEmpty}
    />
  );
}

export default function Index(): ReactNode {
  return (
    <FullScreenLayout title="Categories">
      <CategoriesList />
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  typeSelector: {
    marginVertical: 16,
    marginHorizontal: 24,
  } satisfies ViewStyle,

  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  listItem: {
    marginHorizontal: 12,
    borderRadius: 4,
  } satisfies ViewStyle,
});
