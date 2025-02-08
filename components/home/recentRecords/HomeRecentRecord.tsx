import { type ReactNode, useMemo } from 'react';
import type { RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { ListItem, Text } from '@ui-kitten/components';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { showConfirm } from '@/helpers/showConfirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';
import { useActionSheet } from '@/hooks/useActionSheet';
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

  const dateFormatter = useDateFormatter({ month: 'long', day: 'numeric' });

  const date = useMemo(() => {
    const now = new Date();

    if (
      now.getFullYear() === props.record.date.getFullYear()
      && now.getMonth() === props.record.date.getMonth()
      && now.getDate() === props.record.date.getDate()
    ) {
      return 'Today';
    }
    return dateFormatter.format(props.record.date);
  }, [props.record.dateUnix]);

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
    title: t('actionsSheet.title', {
      entity: `${props.record.category.name} ${value}`,
    }),

    actions: [
      {
        text: t('actionsSheet.edit'),

        onPress: () => router.push({
          pathname: '/records/[recordId]/edit',
          params: { recordId: props.record.id },
        }),
      },

      {
        text: t('actionsSheet.delete'),
        style: 'destructive',

        async onPress() {
          if (await isDeleteConfirmed()) deleteMutation.mutate();
        },
      },

      {
        text: t('actionsSheet.cancel'),
        style: 'cancel',
      },
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
    borderRadius: 4,
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
