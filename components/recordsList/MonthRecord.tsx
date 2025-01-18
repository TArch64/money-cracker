import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { showConfirm } from '@/helpers/showConfirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';
import { Icon, IconName } from '@/components/uiKitten';
import { SwipeActionView } from '@/components/SwipeActionView';

export interface IMonthRecordProps {
  record: RecordWithCategory;
}

export function MonthRecord(props: IMonthRecordProps): ReactNode {
  const theme = useTheme();
  const router = useRouter();
  const dateFormatter = useDateFormatter({ month: 'long', day: 'numeric' });
  const moneyFormatter = useMoneyFormatter();
  const deleteMutation = useRecordDeleteMutation(props.record);

  const isExpense = isExpenseRecord(props.record.type);

  const date = dateFormatter.format(props.record.date);
  const value = moneyFormatter.format(isExpense ? -props.record.value : props.record.value);

  const title = getRecordTypeTitle(props.record.type);
  const status = isExpense ? 'danger' : 'success';

  function openEditRecord(): void {
    router.push({
      pathname: '/records/[recordId]/edit',
      params: { recordId: props.record.id },
    })
  }

  function isDeleteConfirmed(): Promise<boolean> {
    return showConfirm({
      title: `Delete ${title}`,
      message: `Are you sure you want to delete this ${title.toLowerCase()}?`,

      accept: {
        text: 'Delete',
        style: 'destructive',
      },
    });
  }

  return (
    <SwipeActionView
      rowStyle={styles.row}

      left={{
        icon: IconName.EDIT_OUTLINE,
        status: 'info',

        onAction: () => router.push({
          pathname: '/records/[recordId]/edit',
          params: { recordId: props.record.id },
        }),
      }}

      right={{
        icon: IconName.TRASH_OUTLINE,
        status: 'danger',

        async onAction() {
          if (await isDeleteConfirmed()) deleteMutation.mutate();
        },
      }}
    >
      <View
        style={[
          styles.label,
          { backgroundColor: theme[`color-${status}-500`] },
        ]}
      />

      <View>
        <Text style={styles.categoryName}>
          {props.record.category.name}
        </Text>

        <View style={styles.dateRow}>
          <Icon
            name={IconName.CALENDAR_OUTLINE}
            style={styles.dateIcon}
            fill={theme['color-basic-600']}
          />

          <Text
            style={[
              styles.date,
              { color: theme['color-basic-600'] },
            ]}
          >
            {date}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.value,
          { color: theme[`color-${status}-500`] },
        ]}
      >
        {value}
      </Text>
    </SwipeActionView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,

  label: {
    width: 6,
    height: '100%',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    marginRight: 6,
    position: 'relative',
    top: 2,
  } satisfies ViewStyle,

  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
  } satisfies TextStyle,

  dateRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
  } satisfies ViewStyle,

  dateIcon: {
    width: 18,
    height: 18,
  } satisfies ViewStyle,

  date: {
    fontSize: 14,
    marginLeft: 4,
  } satisfies TextStyle,

  value: {
    marginLeft: 'auto',
    alignSelf: 'center'
  } satisfies TextStyle,
});
