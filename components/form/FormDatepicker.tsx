import { type ReactNode, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFormField } from './useFormField';
import { Keyboard, Pressable, type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import { useDateFormatter } from '@/hooks/formatters';
import { DropdownView } from '@/components/DropdownView';

export interface IFormDatepickerProps {
  label: string;
  placeholder: string;
  name: string;
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

  const [isOpened, setOpened] = useState(false);
  const containerStyle = useContainerStyle(isOpened, !!error);

  function open() {
    Keyboard.dismiss();
    setOpened(true);
  }

  const close = () => setOpened(false);

  function onChange(date?: Date) {
    field.handleChange(date);
    close();
  }

  return (
    <DropdownView
      isOpened={isOpened}
      onOpen={open}
      onClose={close}

      activator={(activatorProps) => (
        <>
          <Pressable {...activatorProps} onPress={isOpened ? close : open}>
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
        </>
      )}
    >
      {() => (
        <DateTimePicker
          display="inline"
          value={field.state.value}
          onChange={(_, date) => onChange(date)}
        />
      )}
    </DropdownView>
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
