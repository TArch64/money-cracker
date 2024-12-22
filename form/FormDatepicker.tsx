import type { ReactNode } from 'react';
import { Datepicker, type DatepickerProps } from '@ui-kitten/components';
import { useFormField } from './useFormField';

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
      status={error ? 'danger' : 'basic'}
    />
  );
}
