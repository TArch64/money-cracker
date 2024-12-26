import type { ReactNode } from 'react';
import { Datepicker, type DatepickerProps } from '@ui-kitten/components';
import { useFormField } from './useFormField';

const minDate = new Date(0);
const maxDate = new Date(2100, 0, 1);

export interface IFormDatepickerProps extends Omit<DatepickerProps, 'date' | 'onSelect'> {
  name: string;
}

export function FormDatepicker(props: IFormDatepickerProps): ReactNode {
  const { name, ...pickerProps } = props;
  const field = useFormField(props.name);
  const error = field.state.meta.errors?.join(', ');

  return (
    <Datepicker
      {...pickerProps}
      date={field.state.value}
      onSelect={field.handleChange}
      min={minDate}
      max={maxDate}
      status={error ? 'danger' : 'basic'}
    />
  );
}
