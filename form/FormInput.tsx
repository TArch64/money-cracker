import { Input, type InputProps, Text } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { FieldApi, useField } from '@tanstack/react-form';
import { useFormContext } from './FormProvider';

export interface IFormInputValueController {
  value: string;

  setValue(value: string): void;
}

export interface IFormInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  name: string;
  valueController: IFormInputValueController;
}

export type FormFieldApi = FieldApi<any, any>;

export function useFormInputField(name: string): FormFieldApi {
  const form = useFormContext();
  // @ts-expect-error
  return useField({ form, name });
}

export function FormInput(props: IFormInputProps): ReactNode {
  const { name, valueController: valueController_, ...inputProps } = props;
  const field = useFormInputField(name);

  const valueController = valueController_ ?? {
    value: field.state.value,
    setValue: (value) => field.handleChange(value),
  };

  const error = field.state.meta.errors?.join(', ');

  return (
    <Input
      {...inputProps}
      value={valueController.value}
      onChangeText={valueController.setValue}
      status={error ? 'danger' : 'basic'}
      caption={!error ? undefined : (props) => (
        <Text {...props}>
          {error}
        </Text>
      )}
    />
  );
}
