import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ListItem, Text } from '@ui-kitten/components';
import { useMoneyFormatter } from '@/hooks/formatters';
import { showConfirm } from '@/helpers/showConfirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';
import { useActionSheet } from '@/hooks/useActionSheet';
import { textRenderer } from '@/components/uiKitten';

export interface IHomeRecentRecordProps {
  record: RecordWithCategory;
}

export function HomeRecentRecord(props: IHomeRecentRecordProps): ReactNode {
  const router = useRouter();
  const deleteMutation = useRecordDeleteMutation(props.record);

  const isExpense = isExpenseRecord(props.record.type);

  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(isExpense ? -props.record.value : props.record.value);

  const title = getRecordTypeTitle(props.record.type);
  const status = isExpense ? 'danger' : 'success';

  const isDeleteConfirmed = () => showConfirm({
    title: `Delete ${title}`,
    message: `Are you sure you want to delete this ${title.toLowerCase()}?`,

    accept: {
      text: 'Delete',
      style: 'destructive',
    },
  });

  const showActionsSheet = useActionSheet(() => ({
    title: `${props.record.category.name} ${value} - Actions`,

    actions: [
      {
        text: 'Edit',

        onPress: () => router.push({
          pathname: '/records/[recordId]/edit',
          params: { recordId: props.record.id },
        }),
      },

      {
        text: 'Delete',
        style: 'destructive',

        async onPress() {
          if (await isDeleteConfirmed()) deleteMutation.mutate();
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
      style={styles.row}
      title={textRenderer(props.record.category.name, { style: styles.categoryName })}

      accessoryRight={() => (
        <Text status={status} style={styles.value}>
          {value}
        </Text>
      )}

      onPress={showActionsSheet}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  } satisfies ViewStyle,

  categoryName: {
    fontSize: 14,
    fontWeight: 500,
    paddingVertical: 4,
    marginLeft: 0,
  } satisfies TextStyle,

  value: {
    fontSize: 14,
    marginLeft: 'auto',
    alignSelf: 'center',
  } satisfies TextStyle,
});
