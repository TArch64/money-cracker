import { type ReactNode, useMemo, useState } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { RecordType } from '@/db';
import {
  Form,
  FormAutocomplete,
  FormButtonSelect,
  FormDatepicker,
  formLoadingIndicator,
  FormNumericInput,
  FormSubmit,
  type FormSubmitHandler,
  type IButtonSelectOption,
} from '@/components/form';
import { date, enum_, minLength, minValue, number, object, pipe, string } from 'valibot';
import { KeyboardAvoidingView, StyleSheet, type ViewStyle } from 'react-native';
import { useCategoriesListQuery, useRecordCreateMutation } from '@/hooks/queries';

const schema = object({
  type: enum_(RecordType),
  category: pipe(string(), minLength(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
  date: date(),
});

type Schema = typeof schema;

type SearchParams = {
  type: RecordType;
  initialYear?: string;
  initialMonth?: string;
}

const recordTypeOptions: IButtonSelectOption<RecordType>[] = [
  {
    value: RecordType.EXPENSE,
    label: 'Expense',
  },
  {
    value: RecordType.INCOME,
    label: 'Income',
  },
];

export default function New(): ReactNode {
  const { type: initialType, initialMonth, initialYear } = useLocalSearchParams<SearchParams>();
  const router = useRouter();

  const [type, setType] = useState(initialType);
  const isIncome = type === RecordType.INCOME;
  const screenTitle = isIncome ? 'Income' : 'Expense';
  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  const initialDate = useMemo(() => {
    return initialYear !== undefined && initialMonth !== undefined
      ? new Date(+initialYear, +initialMonth, 1)
      : new Date();
  }, []);

  const categoriesQuery = useCategoriesListQuery(type, (categories) => {
    return categories.map((category) => category.name);
  });

  const createRecordMutation = useRecordCreateMutation();

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync(event.value);
    router.dismissAll();
    router.replace('/records/list');
  };

  return (
    <FullScreenLayout title={`New ${screenTitle}`} style={styles.root}>
      <Form
        schema={schema}
        initialValues={{
          type: initialType,
          category: '',
          value: 0,
          date: initialDate,
        }}
        onSubmit={onSubmit}
      >
        {({ f }) => (
          <KeyboardAvoidingView
            style={styles.formColumn}
            behavior="padding"
            keyboardVerticalOffset={140}
          >
            <FormButtonSelect
              name={f('type')}
              options={recordTypeOptions}
              onChange={setType}
            />

            <FormAutocomplete
              name={f('category')}
              label="Category"
              placeholder="Category"
              suggestions={categoriesQuery.data}
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
    paddingHorizontal: 24,
    paddingBottom: 104,
  } satisfies ViewStyle,

  formColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    flex: 1,
  } satisfies ViewStyle,

  formSubmit: {
    marginTop: 'auto',
  } satisfies ViewStyle,
});
