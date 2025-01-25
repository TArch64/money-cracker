import type { IPropsWithStyle } from '@/types';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { Button, Text, useTheme } from '@ui-kitten/components';

export type ButtonSelectValue = string | number;

export interface IButtonSelectOption<V extends ButtonSelectValue> {
  value: V;
  label: string;
}

export interface IButtonSelectProps<V extends ButtonSelectValue> extends IPropsWithStyle<ViewStyle> {
  value: V;
  options: IButtonSelectOption<V>[];
  onChange: (value: V) => void;
}

export function ButtonSelect<V extends ButtonSelectValue>(props: IButtonSelectProps<V>): ReactNode {
  const theme = useTheme();

  function onChange(option: IButtonSelectOption<V>) {
    if (option.value !== props.value) {
      props.onChange(option.value);
    }
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
            props.value === option.value && { backgroundColor: theme['background-basic-color-3'] },
          ]}
          size="small"
          appearance="ghost"
          status={props.value === option.value ? 'primary' : 'basic'}
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
