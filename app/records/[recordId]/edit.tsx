import type { ReactNode } from 'react';
import { FormScreenLayout } from '@/components/layout';
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
  const searchParams = useLocalSearchParams<{ recordId: string }>();
  const recordQuery = useRecordDetailsSuspenseQuery(+searchParams.recordId);
  const updateMutation = useRecordUpdateMutation(recordQuery.data);

  const categoriesQuery = useCategoriesListQuery({
    type: recordQuery.data.type,
    subkey: ['suggestions'],
    select: (categories) => categories.map((category) => category.name),
  });

  const isIncome = isIncomeRecord(recordQuery.data.type);
  const typeTitle = getRecordTypeTitle(recordQuery.data.type);
  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    updateMutation.mutate(event.value);
    router.back();
  }

  return (
    <FormScreenLayout
      fullScreen
      title={`Edit ${typeTitle}`}
      schema={schema}
      onSubmit={onSubmit}

      initialValues={{
        category: recordQuery.data.category.name,
        value: recordQuery.data.value,
        date: recordQuery.data.date,
      }}

      submit={`Save ${typeTitle}`}
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
