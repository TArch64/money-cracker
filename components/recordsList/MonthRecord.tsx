import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { ListItem, Text, useTheme } from '@ui-kitten/components';
import { useMoneyFormatter } from '@/hooks/formatters';
import { showConfirm } from '@/helpers/showConfirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';
import { useActionSheet } from '@/hooks/useActionSheet';
import { textRenderer } from '@/components/uiKitten';
import { useTranslation } from 'react-i18next';

export interface IMonthRecordProps {
  record: RecordWithCategory;
}

export function MonthRecord(props: IMonthRecordProps): ReactNode {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const deleteMutation = useRecordDeleteMutation(props.record);

  const isExpense = isExpenseRecord(props.record.type);

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
      {
        text: t('actionsSheet.edit'),

        onPress: () => router.push({
          pathname: '/records/[recordId]/edit',
          params: { recordId: props.record.id },
        })
      },

      {
        text: t('actionsSheet.delete'),
        style: 'destructive',

        async onPress() {
          if (await isDeleteConfirmed()) deleteMutation.mutate();
        }
      },

      {
        text: t('actionsSheet.cancel'),
        style: 'cancel',
      },
    ]
  }));

  return (
    <ListItem
      style={styles.row}

      accessoryLeft={() => (
        <View
          style={[
            styles.label,
            { backgroundColor: theme[`color-${status}-500`] },
          ] satisfies StyleProp<ViewStyle>}
        />
      )}

      title={textRenderer(props.record.category.name, {
        style: styles.categoryName,
      })}

      accessoryRight={() => (
        <Text
          style={[
            styles.value,
            { color: theme[`color-${status}-500`] },
          ] satisfies StyleProp<TextStyle>}
        >
          {value}
        </Text>
      )}

      onPress={showActionsSheet}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 4,
  } satisfies ViewStyle,

  label: {
    width: 6,
    height: '100%',
    borderRadius: 4,
    marginRight: 8,
  } satisfies ViewStyle,

  categoryName: {
    fontSize: 16,
    fontWeight: 600,
    paddingVertical: 4,
  } satisfies TextStyle,

  value: {
    marginLeft: 'auto',
    alignSelf: 'center'
  } satisfies TextStyle,
});
