import { type ReactNode, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { type CategoryWithUsage, useCategoriesListWithUsageQuery, useCategoryDeleteMutation } from '@/hooks/queries';
import { useActionSheet } from '@/hooks/useActionSheet';
import { RecordType } from '@/enums';
import { ButtonSelect, type IButtonSelectOption } from '@/components/ButtonSelect';
import { List, ListItem, Text, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { showConfirm } from '@/helpers/showConfirm';
import { useRouter } from 'expo-router';
import { IconName, iconRenderer } from '@/components/uiKitten';

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
  const router = useRouter();
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

  const showActionsSheet = useActionSheet(() => ({
    title: `${props.category.name} - Actions`,

    actions: [
      {
        text: 'Rename',

        onPress: () => router.push({
          pathname: '/settings/categories/[categoryId]/edit',
          params: { categoryId: props.category.id },
        }),
      },

      {
        text: 'Delete',
        style: 'destructive',
        disabled: props.category.budgetExists || props.category.recordExists,

        async onPress() {
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
    ]
  }));

  return (
    <ListItem
      title={props.category.name}
      style={styles.listItem}
      onPress={showActionsSheet}
    />
  );
}

interface ICategoriesListProps {
  type: RecordType;
  onTypeChange: (type: RecordType) => void;
}

function CategoriesList(props: ICategoriesListProps): ReactNode {
  const theme = useTheme();
  const categoriesQuery = useCategoriesListWithUsageQuery(props.type);

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
          value={props.type}
          onChange={props.onTypeChange}
          options={recordTypeOptions}
          style={styles.typeSelector}
        />
      }

      ListEmptyComponent={ListEmpty}
    />
  );
}

export default function Index(): ReactNode {
  const router = useRouter();
  const [type, setType] = useState(RecordType.EXPENSE);

  function openCreate() {
    router.push({
      pathname: '/settings/categories/new',
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

const styles = StyleSheet.create({
  typeSelector: {
    marginVertical: 16,
    marginHorizontal: 16,
  } satisfies ViewStyle,

  listEmpty: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  listItem: {
    paddingHorizontal: 4,
    marginHorizontal: 8,
    borderRadius: 4,
  } satisfies ViewStyle,
});
