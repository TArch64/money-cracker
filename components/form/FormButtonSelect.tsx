import type { ReactNode } from 'react';
import { useFormField } from './useFormField';
import { ButtonSelect, type ButtonSelectValue, type IButtonSelectProps } from '../ButtonSelect';

export interface IFormButtonSelectProps<V extends ButtonSelectValue> extends Omit<IButtonSelectProps<V>, 'value' | 'onChange'> {
  name: string;
  onChange?: (value: V) => void;
}

export function FormButtonSelect<V extends ButtonSelectValue>(props: IFormButtonSelectProps<V>): ReactNode {
  const { name, onChange: onChangeOuter, ...selectProps } = props;
  const field = useFormField(props.name);

  return (
    <ButtonSelect
      {...selectProps}
      value={field.state.value}

      onChange={(value) => {
        field.handleChange(value);
        props.onChange?.(value);
      }}
    />
  );
}
