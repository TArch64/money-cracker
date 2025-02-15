import { type ReactNode, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { date, minLength, minValue, number, object, pipe, string } from 'valibot';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { useCategoriesListQuery, useRecordDetailsSuspenseQuery, useRecordUpdateMutation } from '@/hooks/queries';
import { getRecordTypeTitle } from '@/enums';
import { FormAutocomplete, FormDatepicker, FormNumericInput, type FormSubmitHandler } from '@/components/form';

export default function Edit(): ReactNode {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useLocalSearchParams<{ recordId: string }>();
  const recordQuery = useRecordDetailsSuspenseQuery(+searchParams.recordId);
  const updateMutation = useRecordUpdateMutation(recordQuery.data);

  const schema = useMemo(() => object({
    category: pipe(string(), minLength(1, t('form.errors.required'))),
    value: pipe(number(), minValue(1, t('form.errors.required'))),
    date: date(),
  }), []);

  type Schema = typeof schema;

  const categoriesQuery = useCategoriesListQuery({
    type: recordQuery.data.type,
    subkey: ['suggestions'],
    select: (categories) => categories.map((category) => category.name),
  });

  const screenTitle = getRecordTypeTitle(t, recordQuery.data.type);

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    updateMutation.mutate(event.value);
    router.back();
  };

  return (
    <FormScreenLayout
      fullScreen
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
