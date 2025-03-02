import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { ListItem } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useActionSheet } from '@/hooks/actionSheet';
import { showConfirm } from '@/helpers/showConfirm';
import { type CategoryWithUsage, useCategoryDeleteMutation } from '@/hooks/queries';

interface ICategoryListItemProps {
  category: CategoryWithUsage;
}

export function CategoryListItem(props: ICategoryListItemProps): ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
  const deleteMutation = useCategoryDeleteMutation();

  const isDeleteConfirmed = () => showConfirm({
    title: t('confirm.delete.title', { entity: t('categories.index.delete.entity') }),
    message: t('confirm.delete.message', { entity: t('categories.index.delete.entity').toLowerCase() }),

    accept: {
      text: t('confirm.delete.accept'),
      style: 'destructive',
    },
  });

  const showActionsSheet = useActionSheet((ctx) => ({
    title: props.category.name,

    actions: [
      ctx
        .action(t('actionsSheet.rename'))
        .onPress(() => router.push({
          pathname: '/categories/[categoryId]/edit',
          params: { categoryId: props.category.id },
        })),

      ctx
        .action(t('actionsSheet.delete'))
        .asDestructive()
        .asDisabled(props.category.budgetExists || props.category.recordExists)

        .onPress(async () => {
          if (!await isDeleteConfirmed()) {
            return;
          }

          await deleteMutation.mutateAsync({
            id: props.category.id,
            type: props.category.type,
          });
        }),

      ctx.cancel(),
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
    borderRadius: 8,
  } satisfies ViewStyle,
});
