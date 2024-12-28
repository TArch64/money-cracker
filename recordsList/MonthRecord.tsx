import { type ReactNode, useMemo } from 'react';
import type { RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';

export interface IMonthRecordProps {
  record: RecordWithCategory;
}

export function MonthRecord(props: IMonthRecordProps): ReactNode {
  const theme = useTheme();

  const date = useMemo(() => {
    return props.record.date.toLocaleDateString('default', { month: 'long', day: 'numeric' });
  }, [props.record.dateUnix]);

  return (
    <View style={styles.row}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 8,
    paddingVertical: 12,
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
});
