import type { ReactNode } from 'react';
import { useFormField } from './useFormField';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Button, Text, useTheme } from '@ui-kitten/components';
import type { IPropsWithStyle } from '@/types';

export type FormButtonSelectValue = string | number;

export interface IButtonSelectOption<V extends FormButtonSelectValue> {
  value: V;
  label: string;
}

export interface IFormButtonSelectProps<V extends FormButtonSelectValue> extends IPropsWithStyle<ViewStyle> {
  name: string;
  options: IButtonSelectOption<V>[];
  onChange?: (value: V) => void;
}

export function FormButtonSelect<V extends FormButtonSelectValue>(props: IFormButtonSelectProps<V>): ReactNode {
  const theme = useTheme();
  const field = useFormField(props.name);

  function onChange(option: IButtonSelectOption<V>) {
    if (option.value === field.state.value) {
      return;
    }

    field.setValue(option.value);
    props.onChange?.(option.value);
  }

  return (
    <View
      style={[
        {
          backgroundColor: theme['background-basic-color-2'],
          borderColor: theme['background-basic-color-3'],
        },
        styles.row,
        props.style,
      ]}
    >
      {props.options.map((option) => (
        <Button
          key={option.value}
          style={[
            styles.option,
            field.state.value === option.value && { backgroundColor: theme['background-basic-color-3'] },
          ]}
          size="small"
          appearance="ghost"
          status={field.state.value === option.value ? 'primary' : 'basic'}
          onPress={() => onChange(option)}
        >
          {(txtProps) => (
            <Text
              {...txtProps}
              style={[txtProps?.style, styles.optionText]}
            >
              {option.label}
            </Text>
          )}
        </Button>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 4,
    padding: 3,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'solid',
  } satisfies ViewStyle,

  option: {
    flexBasis: 0,
    flexGrow: 1,
    borderRadius: 2,
    paddingVertical: 2,
  } satisfies ViewStyle,

  optionText: {
    fontSize: 14,
    fontWeight: '400',
  } satisfies TextStyle,
});
