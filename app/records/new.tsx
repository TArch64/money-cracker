import { type ReactNode, useMemo, useState } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button, Text } from '@ui-kitten/components';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRecordTypeTitle, isIncomeRecord, RecordType } from '@/enums';
import {
  Form,
  FormAutocomplete,
  FormButtonSelect,
  FormDatepicker,
  FormNumericInput,
  type FormSubmitHandler,
  type IButtonSelectOption,
} from '@/components/form';
import { date, enum_, minLength, minValue, number, object, pipe, string } from 'valibot';
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
  const isIncome = isIncomeRecord(type);
  const screenTitle = getRecordTypeTitle(type);
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
