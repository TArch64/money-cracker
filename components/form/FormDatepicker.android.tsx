import type { ReactNode } from 'react';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useDateFormatter } from '@/hooks/formatters';
import { useFormField } from './useFormField';
import { FormFieldContainer } from './FormFieldContainer';

export interface IFormDatepickerProps {
  label: string;
  placeholder: string;
  name: string;
}

export function FormDatepicker(props: IFormDatepickerProps): ReactNode {
  const field = useFormField(props.name);

  const dataFormatter = useDateFormatter({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isPlaceholder = !field.state.value;
  const value = field.state.value ?? new Date();
  const displayingValue = isPlaceholder ? props.placeholder : dataFormatter.format(value);

  const error = field.state.meta.errors?.join(', ');

  return (
    <FormFieldContainer
      label={props.label}
      active={false}
      displayingValue={displayingValue}
      error={error}
      placeholder={isPlaceholder}

      pressable={{
        onPress: () => DateTimePickerAndroid.open({
          value,
          onChange: (_, date) => field.handleChange(date),
        }),
      }}
    />
  );
}
