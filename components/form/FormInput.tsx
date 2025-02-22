import { Input, type InputProps } from '@ui-kitten/components';
import { ValiError } from 'valibot';
import { forwardRef, useMemo } from 'react';
import type { FormSchema } from '@/components/form/Form';
import { useFormField } from './useFormField';
import { formErrorRenderer } from './FormError';

export interface IFormInputValueController {
  value: string;
  setValue: (value: string) => void;
}

export interface IFormInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  name: string;
  valueController?: IFormInputValueController;
}

export const FormInput = forwardRef<Input, IFormInputProps>((props, ref) => {
  const { name, valueController: valueController_, ...inputProps } = props;
  const field = useFormField(name);

  const valueController = valueController_ ?? useMemo(() => ({
    value: field.state.value,
    setValue: (value) => field.handleChange(value),
  }), [field.state.value]);

  const error = field.state.meta.errors?.map((error: ValiError<FormSchema>) => error.message).join(', ');

  return (
    <Input
      {...inputProps}
      ref={ref}
      value={valueController.value}
      onChangeText={valueController.setValue}
      status={error ? 'danger' : 'basic'}
      caption={formErrorRenderer(error)}
    />
  );
});
