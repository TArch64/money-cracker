import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ListItem, Text } from '@ui-kitten/components';
import { useDistanceDayFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { showConfirm } from '@/helpers/showConfirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';
import { CancelSheetAction, PlainSheetAction, useActionSheet } from '@/hooks/actionSheet';
import { textRenderer } from '@/components/uiKitten';
import { useTranslation } from 'react-i18next';

export interface IHomeRecentRecordProps {
  record: RecordWithCategory;
}

export function HomeRecentRecord(props: IHomeRecentRecordProps): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const deleteMutation = useRecordDeleteMutation(props.record);

  const isExpense = isExpenseRecord(props.record.type);
  const date = useDistanceDayFormatter(props.record.date);

  const moneyFormatter = useMoneyFormatter();
  const value = moneyFormatter.format(isExpense ? -props.record.value : props.record.value);

  const title = getRecordTypeTitle(t, props.record.type);
  const status = isExpense ? 'danger' : 'success';

  const isDeleteConfirmed = () => showConfirm({
    title: t('confirm.delete.title', { entity: title }),
    message: t('confirm.delete.message', { entity: title.toLowerCase() }),

    accept: {
      text: t('confirm.delete.accept'),
      style: 'destructive',
    },
  });

  const showActionsSheet = useActionSheet(() => ({
    title: `${props.record.category.name} ${value}`,

    actions: [
      PlainSheetAction
        .named(t('actionsSheet.edit'))

        .onPress(() => router.push({
          pathname: '/records/[recordId]/edit',
          params: { recordId: props.record.id },
        })),

      PlainSheetAction
        .named(t('actionsSheet.delete'))
        .asDestructive()
        .onPress(async () => {
          if (await isDeleteConfirmed()) deleteMutation.mutate();
        }),

      CancelSheetAction.named(t('actionsSheet.cancel')),
    ],
  }));

  return (
    <ListItem
      style={styles.row}

      title={textRenderer(props.record.category.name, {
        style: styles.categoryName,
      })}

      description={textRenderer(date, {
        style: styles.date,
      })}

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
    borderRadius: 6,
  } satisfies ViewStyle,

  categoryName: {
    fontSize: 14,
    fontWeight: 500,
    paddingVertical: 4,
    marginLeft: 0,
  } satisfies TextStyle,

  date: {
    marginLeft: 0,
    fontSize: 10,
  } satisfies TextStyle,

  value: {
    fontSize: 14,
    marginLeft: 'auto',
    alignSelf: 'center',
  } satisfies TextStyle,
});
