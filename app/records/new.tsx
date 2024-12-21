import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecordType } from '@/db';
import {
  Form,
  formLoadingIndicator,
  FormNumericInput,
  FormSelect,
  FormSubmit,
  type FormSubmitHandler,
  type IFormSelectItem,
} from '@/form';
import { minValue, number, object, pipe } from 'valibot';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { useCategoriesListQuery, useRecordCreateMutation } from '@/queries';

const schema = object({
  categoryId: pipe(number(), minValue(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
});

type Schema = typeof schema;

export default function New(): ReactNode {
  const { type } = useLocalSearchParams<{ type: RecordType }>();
  const isIncome = type === RecordType.INCOME;
  const screenTitle = isIncome ? 'Income' : 'Expense';
  const router = useRouter();

  const categoriesQuery = useCategoriesListQuery(type);
  const createRecordMutation = useRecordCreateMutation();

  const categorySelectItems = categoriesQuery.data.map((category): IFormSelectItem => ({
    value: category.id,
    title: category.name,
  }));

  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync({ ...event.value, type });
    router.replace('/records/list');
  };

  return (
    <FullScreenLayout name="records/new" style={styles.root}>
      <Text category="h1" style={styles.heading}>
        New {screenTitle}
      </Text>

      <Form
        schema={schema}
        initialValues={{
          categoryId: -1,
          value: 0,
        }}
        onSubmit={onSubmit}
      >
        {({ f }) => (
          <View style={styles.formColumn}>
            <FormSelect
              name={f('categoryId')}
              label="Category"
              placeholder="Category"
              items={categorySelectItems}
            />

            <FormNumericInput
              name={f('value')}
              label={valueLabel}
              placeholder={valueLabel}
            />

            <FormSubmit>
              {({ submit, isSubmitting, disabled }) => (
                <Button
                  accessoryLeft={formLoadingIndicator(isSubmitting)}
                  disabled={disabled}
                  onPress={submit}
                >
                  {textProps => <Text {...textProps}>Add {screenTitle}</Text>}
                </Button>
              )}
            </FormSubmit>
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
