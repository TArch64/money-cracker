import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRecordTypeTitle, IntroState, isIncomeRecord, RecordType } from '@/enums';
import { FormAutocomplete, FormDatepicker, FormNumericInput, type FormSubmitHandler } from '@/components/form';
import { date, minLength, minValue, number, object, pipe, string } from 'valibot';
import { useCategoriesListQuery, useRecordCreateMutation, useUserUpdateMutation } from '@/hooks/queries';
import { useMonthStore } from '@/stores';

const schema = object({
  category: pipe(string(), minLength(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
  date: date(),
});

type Schema = typeof schema;

export default function New(): ReactNode {
  const searchParams = useLocalSearchParams<{
    type: RecordType;
    intro?: 'yes'
  }>();

  const isIntro = searchParams.intro === 'yes';
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const router = useRouter();

  const isIncome = isIncomeRecord(searchParams.type);
  const screenTitle = getRecordTypeTitle(searchParams.type);
  const valueLabel = isIncome ? 'Money received' : 'Money spent';

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
  const updateUserMutation = useUserUpdateMutation();

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync({
      ...event.value,
      type: searchParams.type,
    });

    if (isIntro) {
      await updateUserMutation.mutateAsync({
        intro: IntroState.COMPLETED,
      });
    }

    router.dismissAll();
    router.replace('/records');
  };

  return (
    <FormScreenLayout
      fullScreen
      title={`New ${screenTitle}`}
      schema={schema}
      onSubmit={onSubmit}

      initialValues={{
        category: '',
        value: 0,
        date: initialDate,
      }}

      submit={`Add ${screenTitle}`}
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
  );
}
