import { forwardRef, useState } from 'react';
import type { Input } from '@ui-kitten/components';
import { FormInput, type IFormInputProps, type IFormInputValueController } from './FormInput';
import { type FormFieldApi, useFormField } from './useFormField';

export interface IFormNumericInputProps extends Omit<IFormInputProps, 'valueController' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'autoCorrect'> {
}

function useValueController(field: FormFieldApi): IFormInputValueController {
  const [actualValue, setActualValue] = useState(() => {
    if (!field.state.value) return '';
    return field.state.value.toString();
  });

  return {
    value: actualValue,

    setValue(value: string) {
      if (value.trim() === '') {
        setActualValue(value);
        return;
      }

      const parsed = parseInt(value);

      if (isNaN(parsed)) {
        setActualValue(value);
        return;
      }

      setActualValue(parsed.toString());
      field.handleChange(parsed);
    },
  };
}

export const FormNumericInput = forwardRef<Input, IFormNumericInputProps>((props, ref) => {
  const field = useFormField(props.name);
  const valueController = useValueController(field);

  return (
    <FormInput
      {...props}
      ref={ref}
      keyboardType="numeric"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      valueController={valueController}
    />
  );
});
