import { type ReactNode, useState } from 'react';
import {
  type FormFieldApi,
  FormInput,
  type IFormInputProps,
  type IFormInputValueController,
  useFormInputField,
} from './FormInput';

export interface IFormNumericInputProps extends Omit<IFormInputProps, 'valueController' | 'keyboardType' | 'autoCapitalize' | 'autoComplete' | 'autoCorrect'> {
}

function useValueController(field: FormFieldApi): IFormInputValueController {
  const [actualValue, setActualValue] = useState(field.state.value);

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

export function FormNumericInput(props: IFormNumericInputProps): ReactNode {
  const field = useFormInputField(props.name);
  const valueController = useValueController(field);

  return (
    <FormInput
      {...props}
      keyboardType="numeric"
      autoCapitalize="none"
      autoComplete="off"
      autoCorrect={false}
      valueController={valueController}
    />
  );
}
