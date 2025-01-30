import { type CategoryWithUsage, useCategoryDeleteMutation } from '@/hooks/queries';
import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { showConfirm } from '@/helpers/showConfirm';
import { useActionSheet } from '@/hooks/useActionSheet';
import { ListItem } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';

interface ICategoryListItemProps {
  category: CategoryWithUsage;
}

export function CategoryListItem(props: ICategoryListItemProps): ReactNode {
  const router = useRouter();
  const deleteMutation = useCategoryDeleteMutation();

  const isDeleteConfirmed = () => showConfirm({
    title: 'Delete Category',
    message: `Are you sure you want to delete "${props.category.name}" category?`,

    accept: {
      text: 'Delete',
      style: 'destructive',
    },
  });

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
    ],
  }));

  return (
    <ListItem
      title={props.category.name}
      style={styles.listItem}
      onPress={showActionsSheet}
    />
  );
}

const styles = StyleSheet.create({
  listItem: {
    paddingHorizontal: 4,
    marginHorizontal: 8,
    borderRadius: 4,
  } satisfies ViewStyle,
});
