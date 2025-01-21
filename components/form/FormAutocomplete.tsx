import { FormInput, type IFormInputProps, type IFormInputValueController } from './FormInput';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, View, type ViewStyle } from 'react-native';
import { Menu, MenuItem, useTheme } from '@ui-kitten/components';
import { useFormField } from './useFormField';
import { HighlightText } from '../uiKitten';
import { DropdownView } from '../DropdownView';
import { AnimatedHeight } from '../AnimatedHeight';

interface IAutocompleteMenuProps {
  value: string;
  suggestions: string[];
  onSelect: (value: string) => void;
}

function AutocompleteMenu(props: IAutocompleteMenuProps) {
  const theme = useTheme();

  return (
    <AnimatedHeight>
      {(ctx) => (
        <Menu onContentSizeChange={ctx.update}>
          {props.suggestions.map((suggestion) => (
            <MenuItem
              style={{ backgroundColor: theme['background-basic-color-1'] } satisfies ViewStyle}
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
      )}
    </AnimatedHeight>
  );
}

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

  function selectSuggestions(value: string) {
    Keyboard.dismiss();
    valueController.setValue(value);
    setOpened(false);
  }

  return (
    <DropdownView
      isOpened={isOpened && !!displayingSuggestions.length}
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}

      activator={(activatorProps) => (
        <View {...activatorProps}>
          <FormInput
            {...inputProps}
            valueController={valueController}
            onFocus={() => setOpened(true)}
            onBlur={() => setOpened(false)}
            onPress={() => setOpened(true)}
          />
        </View>
      )}
    >
      {() => (
        <AutocompleteMenu
          value={valueController.value}
          onSelect={selectSuggestions}
          suggestions={displayingSuggestions}
        />
      )}
    </DropdownView>
  );
}
