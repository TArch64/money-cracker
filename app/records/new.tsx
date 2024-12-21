import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/layout';
import { Text } from '@ui-kitten/components';
import { useLocalSearchParams } from 'expo-router';
import { RecordType } from '@/db';
import { Form, FormNumericInput, FormSelect, type IFormSelectItem } from '@/form';
import { minValue, number, object, pipe, string } from 'valibot';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { useCategoriesListQuery } from '@/queries';

const schema = object({
  category: string(),
  value: pipe(number(), minValue(1)),
});

export default function New(): ReactNode {
  const { type } = useLocalSearchParams<{ type: RecordType }>();
  const isIncome = type === RecordType.INCOME;
  const categoriesQuery = useCategoriesListQuery(type);

  const categorySelectItems = categoriesQuery.data.map((category): IFormSelectItem => ({
    value: category.id,
    title: category.name,
  }));

  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  return (
    <FullScreenLayout name="records/new" style={styles.root}>
      <Text category="h1" style={styles.heading}>
        New {isIncome ? 'Income' : 'Expense'}
      </Text>

      <Form
        schema={schema}
        initialValues={{
          category: '',
          value: 0,
        }}
      >
        {({ f }) => (
          <View style={styles.formColumn}>
            <FormSelect
              name={f('category')}
              label="Category"
              placeholder="Category"
              items={categorySelectItems}
            />

            <FormNumericInput
              name={f('value')}
              label={valueLabel}
              placeholder={valueLabel}
            />
          </View>
        )}
      </Form>
    </FullScreenLayout>
  )
}

const styles = StyleSheet.create({
  root: {
    padding: 24,
  } satisfies ViewStyle,

  heading: {
    marginBottom: 20,
  } satisfies TextStyle,

  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  } satisfies ViewStyle,
});
