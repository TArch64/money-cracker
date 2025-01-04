import type { ReactNode } from 'react';
import type { RecordWithCategory } from '@/db';
import { Pressable, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Button, Icon, Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter, useMoneyFormatter } from '@/hooks/formatters';
import { ActionsSheetModal } from '@/components/bottomSheet';
import { confirm } from '@/helpers/confirm';
import { useRecordDeleteMutation } from '@/hooks/queries';
import { useRouter } from 'expo-router';
import { getRecordTypeTitle, isExpenseRecord } from '@/enums';

export interface IMonthRecordProps {
  record: RecordWithCategory;
}

function DeleteAction(props: IMonthRecordProps): ReactNode {
  const deleteMutation = useRecordDeleteMutation(props.record);
  const title = getRecordTypeTitle(props.record.type);

  function isDeleteConfirmed(): Promise<boolean> {
    return confirm({
      title: `Delete ${title}`,
      message: `Are you sure you want to delete this ${title.toLowerCase()}?`,

      accept: {
        text: 'Delete',
        style: 'destructive',
      },
    });
  }

  async function deleteRecord(): Promise<void> {
    if (await isDeleteConfirmed()) {
      deleteMutation.mutate();
    }
  }

  return (
    <Button
      appearance="ghost"
      status="danger"
      onPress={deleteRecord}
    >
      {txtProps => <Text {...txtProps}>Delete {title}</Text>}
    </Button>
  );
}

export function MonthRecord(props: IMonthRecordProps): ReactNode {
  const theme = useTheme();
  const router = useRouter();
  const dateFormatter = useDateFormatter({ month: 'long', day: 'numeric' });
  const moneyFormatter = useMoneyFormatter();

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

  return (
    <ActionsSheetModal
      activator={({ openModal, ref }) => (
        // @ts-expect-error
        <Pressable ref={ref} style={styles.row} onPress={openModal}>
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
                name="calendar-outline"
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
        </Pressable>
      )}
    >
      {({ withClose }) => (
        <View style={styles.actionsColumn}>
          <Button appearance="ghost" onPress={withClose(openEditRecord)}>
            {txtProps => <Text {...txtProps}>Edit {title}</Text>}
          </Button>

          <DeleteAction record={props.record} />
        </View>
      )}
    </ActionsSheetModal>
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

  actionsColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  } satisfies ViewStyle,
});
