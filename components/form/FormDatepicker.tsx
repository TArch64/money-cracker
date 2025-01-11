import { type ReactNode, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormField } from './useFormField';
import { Keyboard, Pressable, type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter } from '@/hooks/formatters';
import { flip, offset, useFloating } from '@floating-ui/react-native';
import { shift } from '@floating-ui/core';
import { BackdropView } from '@/components/BackdropView';

export interface IFormDatepickerProps {
  label: string;
  placeholder: string;
  name: string;
}

function useContainerStyle(isOpened: boolean, isError: boolean): ViewStyle {
  const theme = useTheme();

  if (isOpened) {
    return {
      borderColor: theme['color-primary-500'],
      backgroundColor: theme['background-basic-color-1'],
    };
  }

  return {
    borderColor: isError ? theme['color-danger-500'] : theme['color-basic-400'],
    backgroundColor: theme['color-basic-200'],
  };
}

export function FormDatepicker(props: IFormDatepickerProps): ReactNode {
  const theme = useTheme();
  const field = useFormField(props.name);

  const dataFormatter = useDateFormatter({
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const isPlaceholder = !field.state.value;
  const value = field.state.value ?? new Date();
  const displayingValue = isPlaceholder ? props.placeholder : dataFormatter.format(value);

  const error = field.state.meta.errors?.join(', ');

  const [floatingWidth, setFloatingWidth] = useState(0);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',

    middleware: [
      flip({ elementContext: 'reference' }),
      shift({ elementContext: 'reference' }),
      offset({ mainAxis: 4 }),
    ],
  });

  const isRendered = !!floatingStyles.top || !!floatingStyles.left;

  const [isOpened, setOpened] = useState(false);
  const containerStyle = useContainerStyle(isOpened, !!error);

  const toggle = () => setOpened((value) => {
    if (!value) Keyboard.dismiss();
    return !value;
  });

  const close = () => setOpened(false);

  return (
    <>
      {isOpened && <BackdropView onPress={close} />}

      <View>
        <Pressable
          collapsable={false}
          ref={refs.setReference}
          onLayout={(event) => setFloatingWidth(event.nativeEvent.layout.width)}
          onPress={toggle}
        >
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
                { color: isPlaceholder ? theme['color-basic-600'] : theme['color-basic-800'] },
              ] satisfies StyleProp<TextStyle>}
            >
              {displayingValue}
            </Text>
          </View>
        </Pressable>

        {error && (
          <Text
            category="c1"
            style={[
              styles.error,
              { color: theme['color-danger-500'] },
            ] satisfies StyleProp<TextStyle>}
          >
            {error}
          </Text>
        )}

        {isOpened && (
          <View
            collapsable={false}
            ref={refs.setFloating}
            style={[
              styles.dropdown,
              floatingStyles,
              {
                width: floatingWidth,
                opacity: isRendered ? 1 : 0,
                backgroundColor: theme['background-basic-color-2'],
              },
            ] satisfies StyleProp<ViewStyle>}
          >
            <DateTimePicker
              display="inline"
              value={field.state.value}
              onChange={(_, date) => field.handleChange(date)}
            />
          </View>
        )}
      </View>
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
    borderWidth: Math.max(StyleSheet.hairlineWidth, 1),
    borderStyle: 'solid',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 7,
    minHeight: 40,
    display: 'flex',
    justifyContent: 'center',
  } satisfies ViewStyle,

  dropdown: {
    zIndex: 1000,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  } satisfies ViewStyle,
});
