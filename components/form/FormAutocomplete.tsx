import { flip, offset, useFloating } from '@floating-ui/react-native';
import { FormInput, type IFormInputProps, type IFormInputValueController } from './FormInput';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Keyboard, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { Menu, MenuItem, useTheme } from '@ui-kitten/components';
import { useFormField } from './useFormField';
import type { IPropsWithStyle } from '@/types';
import { HighlightText } from '../uiKitten';
import { BackdropView } from '../BackdropView';

interface IAutocompleteMenuProps extends IPropsWithStyle<ViewStyle> {
  value: string;
  suggestions: string[];
  onSelect: (value: string) => void;
}

const AutocompleteMenu = forwardRef<View, IAutocompleteMenuProps>((props, ref) => {
  const theme = useTheme();

  return (
    <View
      collapsable={false}
      ref={ref}
      style={[
        props.style,
        styles.dropdownMenu,
      ]}
    >
      <Menu>
        {props.suggestions.map((suggestion) => (
          <MenuItem
            style={{ backgroundColor: theme['background-basic-color-2'] }}
            key={suggestion}
            title={(txtProps) => (
              <HighlightText
                {...txtProps}
                text={suggestion}
                highlight={props.value}
              />
            )}
            onPress={() => props.onSelect(suggestion)}
          />
        ))}
      </Menu>
    </View>
  );
});

export interface IFormAutocompleteProps extends IFormInputProps {
  suggestions: string[];
}

function filterSuggestions(suggestions: string[], value: string): string[] {
  if (!value.trim()) {
    return suggestions.slice(0, 5);
  }

  const lowerValue = value.toLowerCase();
  return suggestions.filter((suggestion) => suggestion.toLowerCase().includes(lowerValue));
}

export function FormAutocomplete(props: IFormAutocompleteProps) {
  const { suggestions, ...inputProps } = props;
  const field = useFormField(props.name);
  const isInitial = useRef(true);

  const [isOpened, setOpened] = useState(false);
  const [floatingWidth, setFloatingWidth] = useState(0);

  const valueController: IFormInputValueController = {
    value: field.state.value,
    setValue: (value) => field.handleChange(value),
  };

  const displayingSuggestions = filterSuggestions(suggestions, valueController.value);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    if (props.suggestions.includes(valueController.value)) {
      setOpened(false);
      return;
    }

    setOpened(true);
  }, [valueController.value]);

  const { refs, floatingStyles } = useFloating({
    placement: 'bottom-start',

    middleware: [
      flip({ elementContext: 'reference' }),
      offset({ mainAxis: 4 }),
    ],
  });

  const isRendered = !!floatingStyles.top || !!floatingStyles.left;

  function selectSuggestions(value: string) {
    Keyboard.dismiss();
    valueController.setValue(value);
    setOpened(false);
  }

  return (
    <>
      {isOpened && !!displayingSuggestions.length && <BackdropView onPress={() => setOpened(false)} />}

      <View
        collapsable={false}
        ref={refs.setReference}
        onLayout={(event) => setFloatingWidth(event.nativeEvent.layout.width)}
      >
        <FormInput
          {...inputProps}
          valueController={valueController}
          onFocus={() => setOpened(true)}
          onBlur={() => setOpened(false)}
          onPress={() => setOpened(true)}
        />
      </View>

      {isOpened && !!displayingSuggestions.length && (
        <AutocompleteMenu
          ref={refs.setFloating}
          style={[
            floatingStyles,
            {
              width: floatingWidth,
              opacity: isRendered ? 1 : 0,
            },
          ] satisfies StyleProp<ViewStyle>}
          value={valueController.value}
          onSelect={selectSuggestions}
          suggestions={displayingSuggestions}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  dropdownMenu: {
    zIndex: 1000,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  } satisfies ViewStyle,
});
