import { type ReactNode, useMemo, useState } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRecordTypeTitle, IntroState, isIncomeRecord, RecordType } from '@/enums';
import {
  FormAutocomplete,
  FormButtonSelect,
  FormDatepicker,
  FormNumericInput,
  type FormSubmitHandler,
  type IButtonSelectOption,
} from '@/components/form';
import { date, enum_, minLength, minValue, number, object, pipe, string } from 'valibot';
import { useCategoriesListQuery, useRecordCreateMutation, useUserUpdateMutation } from '@/hooks/queries';
import { useMonthStore } from '@/stores';

const schema = object({
  type: enum_(RecordType),
  category: pipe(string(), minLength(1, 'This field is required')),
  value: pipe(number(), minValue(1, 'This field is required')),
  date: date(),
});

type Schema = typeof schema;

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

type SearchParams = {
  type: RecordType;
  intro?: 'yes'
};

export default function New(): ReactNode {
  const { type: initialType, intro } = useLocalSearchParams<SearchParams>();
  const isIntro = intro === 'yes';
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const router = useRouter();

  const [type, setType] = useState(initialType);
  const isIncome = isIncomeRecord(type);
  const screenTitle = getRecordTypeTitle(type);
  const valueLabel = isIncome ? 'Money received' : 'Money spent';

  const initialDate = useMemo(() => {
    const now = new Date();

    if (activeMonthIdx.year === now.getFullYear() && activeMonthIdx.month === now.getMonth()) {
      return now;
    }

    return new Date(activeMonthIdx.year, activeMonthIdx.month, 1);
  }, []);

  const categoriesQuery = useCategoriesListQuery({
    type,
    subkey: ['suggestions'],
    select: (categories) => categories.map((category) => category.name),
  });

  const createRecordMutation = useRecordCreateMutation();
  const updateUserMutation = useUserUpdateMutation();

  const onSubmit: FormSubmitHandler<Schema> = async (event) => {
    await createRecordMutation.mutateAsync(event.value);

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
        type: initialType,
        category: '',
        value: 0,
        date: initialDate,
      }}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Add {screenTitle}</Text>}
        </Button>
      )}
    >
      {({ f }) => (
        <>
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
        </>
      )}
    </FormScreenLayout>
  );
}
