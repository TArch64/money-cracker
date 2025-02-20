import { useColorScheme as useColorScheme_ } from 'react-native';
import { ColorScheme } from '@/enums';
import { type EnumValueMap, getEnumValue } from '@/helpers/getEnumValue';

export function useColorScheme(): ColorScheme {
  return useColorScheme_() as ColorScheme | undefined ?? ColorScheme.LIGHT;
}

export function useColorSchemeValue<V>(mapping: EnumValueMap<ColorScheme, V>): V {
  return getEnumValue(useColorScheme(), mapping);
}
