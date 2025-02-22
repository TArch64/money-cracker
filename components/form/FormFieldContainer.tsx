import type { ReactNode } from 'react';
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';

export interface IFormFieldContainerProps {
  label: string;
  active: boolean;
  displayingValue: string;
  placeholder?: boolean;
  error?: string;
  pressable?: PressableProps;
}

function useContainerStyle(isOpened: boolean, isError: boolean): ViewStyle {
  const theme = useTheme();

  if (isOpened) {
    return {
      borderRadius: 8,
      borderColor: theme['color-primary-500'],
      backgroundColor: theme['background-basic-color-1'],
    };
  }

  return {
    borderRadius: 8,
    borderColor: isError ? theme['color-danger-500'] : theme['border-basic-color-4'],
    backgroundColor: theme['background-basic-color-2'],
  };
}

export function FormFieldContainer(props: IFormFieldContainerProps): ReactNode {
  const theme = useTheme();
  const containerStyle = useContainerStyle(props.active, !!props.error);

  return (
    <>
      <Pressable {...props.pressable}>
        <Text
          category="label"
          style={[
            styles.label,
            { color: theme['color-basic-600'] },
          ] satisfies StyleProp<TextStyle>}
        >
          {props.label}
        </Text>

        <View style={[styles.container, containerStyle]}>
          <Text
            category="p1"
            style={[
              styles.value,
              { color: props.placeholder ? theme['text-hint-color'] : theme['text-basic-color'] },
            ] satisfies StyleProp<TextStyle>}
          >
            {props.displayingValue}
          </Text>
        </View>
      </Pressable>

      {props.error && (
        <Text
          category="c1"
          style={[
            styles.error,
            { color: theme['color-danger-500'] },
          ] satisfies StyleProp<TextStyle>}
        >
          {props.error}
        </Text>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 3,
  } satisfies TextStyle,

  value: {
    marginHorizontal: 8,
  } satisfies TextStyle,

  error: {
    marginTop: 4,
  } satisfies TextStyle,

  container: {
    borderWidth: 1,
    borderStyle: 'solid',
    paddingHorizontal: 8,
    paddingVertical: 7,
    minHeight: 40,
    display: 'flex',
    justifyContent: 'center',
  } satisfies ViewStyle,
});
