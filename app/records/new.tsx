import { type ReactNode, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { date, minLength, minValue, number, object, pipe, string } from 'valibot';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { getRecordTypeTitle, RecordType } from '@/enums';
import { FormAutocomplete, FormDatepicker, FormNumericInput, type FormSubmitHandler } from '@/components/form';
import { useCategoriesListQuery, useRecordCreateMutation } from '@/hooks/queries';
import { useMonthStore } from '@/stores';

export default function New(): ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useLocalSearchParams<{ type: RecordType }>();

  const schema = useMemo(() => object({
    category: pipe(string(), minLength(1, t('form.errors.required'))),
    value: pipe(number(), minValue(1, t('form.errors.required'))),
    date: date(),
  }), []);

  type Schema = typeof schema;

  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const screenTitle = getRecordTypeTitle(t, searchParams.type);

  const initialDate = useMemo(() => {
    const now = new Date();

    if (activeMonthIdx.year === now.getFullYear() && activeMonthIdx.month === now.getMonth()) {
      return now;
    }

    return new Date(activeMonthIdx.year, activeMonthIdx.month, 1);
  }, []);

  const categoriesQuery = useCategoriesListQuery({
    type: searchParams.type,
    subkey: ['suggestions'],
    select: (categories) => categories.map((category) => category.name),
  });

  const createRecordMutation = useRecordCreateMutation();

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync({
      ...event.value,
      type: searchParams.type,
    });

    router.back();
  };

  return (
    <FormScreenLayout
      title={t(`records.new.title.${searchParams.type}`)}
      schema={schema}
      onSubmit={onSubmit}

      initialValues={{
        category: '',
        value: 0,
        date: initialDate,
      }}

      submit={t(`records.new.add.${searchParams.type}`)}
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
            label={t(`records.form.labels.value.${searchParams.type}`)}
            placeholder={t(`records.form.labels.value.${searchParams.type}`)}
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
