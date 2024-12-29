import { type ReactNode, useMemo } from 'react';
import { RecordType, type RecordWithCategory } from '@/db';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Icon, Text, useTheme } from '@ui-kitten/components';
import { useLocales } from 'expo-localization';

export interface IMonthRecordProps {
  record: RecordWithCategory;
}

export function MonthRecord(props: IMonthRecordProps): ReactNode {
  const theme = useTheme();
  const [locale] = useLocales();
  const isExpense = props.record.type === RecordType.EXPENSE;

  const dateFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale.languageTag!, {
      month: 'long',
      day: 'numeric',
    });
  }, [locale.languageTag]);

  const date = useMemo(() => {
    return dateFormatter.format(props.record.date);
  }, [props.record.dateUnix]);

  const moneyFormatter = useMemo(() => {
    return new Intl.NumberFormat(locale.languageTag!, {
      style: 'currency',
      currency: locale.currencyCode!,
    });
  }, [locale.currencyCode, locale.languageTag]);

  const value = useMemo(() => {
    return moneyFormatter.format(isExpense ? -props.record.value : props.record.value);
  }, [props.record.type, props.record.value]);

  const status = isExpense ? 'danger' : 'success';

  return (
    <View style={styles.row}>
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
    </View>
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
    alignSelf: 'center',
  } satisfies TextStyle,
});
