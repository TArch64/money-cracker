import { type ReactNode } from 'react';
import { IndexPath, Select, SelectItem, type SelectProps, Text, type TextProps, useTheme } from '@ui-kitten/components';
import { useFormField } from './useFormField';
import { StyleSheet, type TextStyle } from 'react-native';
import { formErrorRenderer } from './FormError';

interface ISelectValueProps extends Omit<TextProps, 'children'> {
  value?: string;
  placeholder: string;
}

function SelectValue(props: ISelectValueProps): ReactNode {
  const { value, placeholder, ...textProps } = props;
  const theme = useTheme();

  return (
    <Text
      {...textProps}
      style={[
        textProps.style,
        styles.selectValue,
        !props.value && { color: theme['color-basic-800'] },
      ]}
    >
      {props.value ?? props.placeholder}
    </Text>
  );
}

export interface IFormSelectItem {
  value: string | number;
  title: string;
}

export interface IFormSelectProps extends Omit<SelectProps, 'selectedIndex' | 'onSelect'> {
  name: string;
  placeholder: string;
  items: IFormSelectItem[];
}

export function FormSelect(props: IFormSelectProps): ReactNode {
  const { name, items, ...selectProps } = props;
  const field = useFormField(name);
  const selectedIndex = items.findIndex((item) => item.value === field.state.value);
  const selectedItem = selectedIndex === -1 ? undefined : items[selectedIndex];
  const selectedPath = selectedIndex === -1 ? undefined : new IndexPath(selectedIndex);

  function selectItem(path: IndexPath | IndexPath[]): void {
    const { row } = path as IndexPath;
    field.handleChange(items[row].value);
  }

  const error = field.state.meta.errors?.join(', ');

  return (
    <Select
      {...selectProps}
      value={(textProps) => (
        <SelectValue
          {...textProps}
          value={selectedItem?.title}
          placeholder={props.placeholder}
        />
      )}
      selectedIndex={selectedPath}
      onSelect={selectItem}
      status={error ? 'danger' : 'basic'}
      caption={formErrorRenderer(error) as SelectProps['caption']}
    >
      {items.map((item) => (
        <SelectItem key={item.value} title={item.title} />
      ))}
    </Select>
  );
}

const styles = StyleSheet.create({
  selectValue: {
    fontWeight: 400,
  } satisfies TextStyle,
});
