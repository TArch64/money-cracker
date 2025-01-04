import type { ReactNode } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCategoriesListQuery, useRecordDetailsSuspenseQuery, useRecordUpdateMutation } from '@/hooks/queries';
import { getRecordTypeTitle, isIncomeRecord } from '@/enums';
import { date, minLength, minValue, number, object, pipe, string } from 'valibot';
import { FormAutocomplete, FormDatepicker, FormNumericInput, type FormSubmitHandler } from '@/components/form';

const schema = object({
  category: pipe(string(), minLength(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
  date: date(),
});

type Schema = typeof schema;

export default function Edit(): ReactNode {
  const router = useRouter();
  const { recordId: recordId_ } = useLocalSearchParams<{ recordId: string }>();
  const recordId = +recordId_;
  const recordQuery = useRecordDetailsSuspenseQuery(recordId);
  const updateMutation = useRecordUpdateMutation(recordQuery.data);

  const categoriesQuery = useCategoriesListQuery(recordQuery.data.type, (categories) => {
    return categories.map((category) => category.name);
  });

  const isIncome = isIncomeRecord(recordQuery.data.type);
  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    updateMutation.mutate(event.value);
    router.back();
  }

  return (
    <FormScreenLayout
      fullScreen
      title={`Edit ${getRecordTypeTitle(recordQuery.data.type)}`}
      schema={schema}
      onSubmit={onSubmit}

      initialValues={{
        category: recordQuery.data.category.name,
        value: recordQuery.data.value,
        date: recordQuery.data.date,
      }}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Update</Text>}
        </Button>
      )}
    >
      {({ f }) => (
        <>
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
        </>
      )}
    </FormScreenLayout>
  )
}
