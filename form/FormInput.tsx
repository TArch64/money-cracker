import { Input, type InputProps, Text } from '@ui-kitten/components';
import type { ReactNode } from 'react';
import { useFormField } from './useFormField';

export interface IFormInputValueController {
  value: string;
  setValue: (value: string) => void;
}

export interface IFormInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  name: string;
  valueController: IFormInputValueController;
}

export function FormInput(props: IFormInputProps): ReactNode {
  const { name, valueController: valueController_, ...inputProps } = props;
  const field = useFormField(name);

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
