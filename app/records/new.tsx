import { type ReactNode, useMemo } from 'react';
import { FullScreenLayout } from '@/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecordType } from '@/db';
import {
  Form,
  FormDatepicker,
  formLoadingIndicator,
  FormNumericInput,
  FormSelect,
  FormSubmit,
  type FormSubmitHandler,
  type IFormSelectItem,
} from '@/form';
import { date, minValue, number, object, pipe } from 'valibot';
import { KeyboardAvoidingView, Platform, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useCategoriesListQuery, useRecordCreateMutation } from '@/queries';

const schema = object({
  categoryId: pipe(number(), minValue(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
  date: date(),
});

type Schema = typeof schema;

type SearchParams = {
  type: RecordType;
  initialYear?: string;
  initialMonth?: string;
}

export default function New(): ReactNode {
  const { type, initialMonth, initialYear } = useLocalSearchParams<SearchParams>();

  const initialDate = useMemo(() => {
    return initialYear !== undefined && initialMonth !== undefined
      ? new Date(+initialYear, +initialMonth, 1)
      : new Date();
  }, []);

  const isIncome = type === RecordType.INCOME;
  const screenTitle = isIncome ? 'Income' : 'Expense';
  const valueLabel = isIncome ? 'Money received' : 'Money spent';
  const router = useRouter();

  const categoriesQuery = useCategoriesListQuery(type);
  const createRecordMutation = useRecordCreateMutation();

  const categorySelectItems = categoriesQuery.data.map((category): IFormSelectItem => ({
    value: category.id,
    title: category.name,
  }));

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync({
      ...event.value,
      type,
    });

    router.dismissAll();
    router.replace('/records/list');
  };

  return (
    <FullScreenLayout title={`New ${screenTitle}`} style={styles.root}>
      <Form
        schema={schema}
        initialValues={{
          categoryId: -1,
          value: 0,
          date: initialDate,
        }}
        onSubmit={onSubmit}
      >
        {({ f }) => (
          <KeyboardAvoidingView
            style={styles.formColumn}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
          >
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

            <FormDatepicker
              name={f('date')}
              label="Date"
              placeholder="Date"
            />

            <FormSubmit>
              {({ submit, isSubmitting, disabled }) => (
                <Button
                  accessoryLeft={formLoadingIndicator(isSubmitting)}
                  disabled={disabled}
                  style={styles.formSubmit}
                  onPress={submit}
                >
                  {textProps => <Text {...textProps}>Add {screenTitle}</Text>}
                </Button>
              )}
            </FormSubmit>
          </KeyboardAvoidingView>
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
    flex: 1,
  } satisfies ViewStyle,

  formSubmit: {
    marginTop: 'auto',
    marginBottom: 80,
  } satisfies ViewStyle,
});
