import { type ReactNode, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Keyboard, StyleSheet, View, type ViewStyle } from 'react-native';
import { useDateFormatter } from '@/hooks/formatters';
import { DropdownView } from '../DropdownView';
import { useFormField } from './useFormField';
import { FormFieldContainer } from './FormFieldContainer';
import type { IFormTimepickerProps } from './FormTimepicker';

export function FormTimepicker(props: IFormTimepickerProps): ReactNode {
  const field = useFormField(props.name);

  const dataFormatter = useDateFormatter({
    hour: 'numeric',
    minute: 'numeric',
  });

  const isPlaceholder = !field.state.value;
  const value = field.state.value ?? new Date();
  const displayingValue = isPlaceholder ? props.placeholder : dataFormatter.format(value);

  const error = field.state.meta.errors?.join(', ');

  const [isOpened, setOpened] = useState(false);

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
        <FormFieldContainer
          label={props.label}
          active={isOpened}
          displayingValue={displayingValue}
          error={error}
          placeholder={isPlaceholder}

          pressable={{
            ...activatorProps,
            onPress: isOpened ? close : open,
          }}
        />
      )}
    >
      {() => (
        <View style={styles.dropdown}>
          <DateTimePicker
            display="spinner"
            mode="time"
            value={field.state.value}
            onChange={(_, date) => onChange(date)}
          />
        </View>
      )}
    </DropdownView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    display: 'flex',
    alignItems: 'center',
  } satisfies ViewStyle,
});
