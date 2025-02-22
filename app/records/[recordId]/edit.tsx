import type { ReactNode } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { date, minLength, minValue, number, object, pipe, string } from 'valibot';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { useCategoriesListQuery, useRecordDetailsSuspenseQuery, useRecordUpdateMutation } from '@/hooks/queries';
import { FormAutocomplete, FormDatepicker, type FormEventHandler, FormNumericInput } from '@/components/form';

const schema = object({
  category: pipe(string(), minLength(1)),
  value: pipe(number(), minValue(1)),
  date: date(),
});

type Schema = typeof schema;

export default function Edit(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ recordId: string }>();
  const recordQuery = useRecordDetailsSuspenseQuery(+searchParams.recordId);
  const updateMutation = useRecordUpdateMutation(recordQuery.data);

  const categoriesQuery = useCategoriesListQuery({
    type: recordQuery.data.type,
    subkey: ['suggestions'],
    select: (categories) => categories.map((category) => category.name),
  });

  const onSubmit: FormEventHandler<Schema> = async (event) => {
    updateMutation.mutate(event.value);
    router.back();
  };

  return (
    <FormScreenLayout
      title={t(`records.edit.title.${recordQuery.data.type}`)}
      schema={schema}
      onSubmit={onSubmit}

      initialValues={{
        category: recordQuery.data.category.name,
        value: recordQuery.data.value,
        date: recordQuery.data.date,
      }}

      submit={t(`records.edit.save.${recordQuery.data.type}`)}
    >
      {({ f }) => (
        <>
          <FormAutocomplete
            name={f('category')}
            label={t('records.form.labels.category')}
            placeholder={t('records.form.labels.category')}
            suggestions={categoriesQuery.data}
          />

          <FormNumericInput
            name={f('value')}
            label={t(`records.form.labels.value.${recordQuery.data.type}`)}
            placeholder={t(`records.form.labels.value.${recordQuery.data.type}`)}
          />

          <FormDatepicker
            name={f('date')}
            label={t('records.form.labels.date')}
            placeholder={t('records.form.labels.date')}
          />
        </>
      )}
    </FormScreenLayout>
  );
}
