import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, type Theme, type ThemeType } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useColorScheme } from 'react-native';
import customMapping from './mapping.json';

type ColorScheme = 'light' | 'dark';

// Colors: https://developer.apple.com/design/human-interface-guidelines/color#iOS-iPadOS-system-colors
const COMMON_THEME: Partial<Theme> = {
  'color-primary-100': '#CCEEFF',
  'color-primary-200': '#99D8FF',
  'color-primary-300': '#66BDFF',
  'color-primary-400': '#3FA4FF',
  'color-primary-500': '#007AFF',
  'color-primary-600': '#005EDB',
  'color-primary-700': '#0046B7',
  'color-primary-800': '#003193',
  'color-primary-900': '#00237A',
  'color-success-100': '#DBFCD6',
  'color-success-200': '#B2F9AF',
  'color-success-300': '#84EE8A',
  'color-success-400': '#62DD75',
  'color-success-500': '#34c759',
  'color-success-600': '#26AB54',
  'color-success-700': '#1A8F4E',
  'color-success-800': '#107346',
  'color-success-900': '#095F40',
  'color-info-100': '#E1E6FF',
  'color-info-200': '#C3CCFF',
  'color-info-300': '#A6B2FF',
  'color-info-400': '#909EFF',
  'color-info-500': '#6B7CFF',
  'color-info-600': '#4E5CDB',
  'color-info-700': '#3541B7',
  'color-info-800': '#222B93',
  'color-info-900': '#141B7A',
  'color-warning-100': '#FFF9CC',
  'color-warning-200': '#FFF099',
  'color-warning-300': '#FFE666',
  'color-warning-400': '#FFDC3F',
  'color-warning-500': '#ffcc00',
  'color-warning-600': '#DBAA00',
  'color-warning-700': '#B78B00',
  'color-warning-800': '#936D00',
  'color-warning-900': '#7A5700',
  'color-danger-100': '#FFE5D5',
  'color-danger-200': '#FFC5AC',
  'color-danger-300': '#FF9E82',
  'color-danger-400': '#FF7863',
  'color-danger-500': '#ff3b30',
  'color-danger-600': '#DB2328',
  'color-danger-700': '#B7182A',
  'color-danger-800': '#930F29',
  'color-danger-900': '#7A0929',
  'color-basic-600': '#7A86A1',
  'box-shadow-1': '0 0 5px rgba(0, 0, 0, 0.1)',
  'box-shadow-2': '0 0 10px rgba(0, 0, 0, 0.1)',
};

const themes: Record<ColorScheme, () => Theme> = {
  light: () => ({
    ...eva.light,
    'background-basic-color-2': '#f8fafc',
  }),

  dark: () => eva.dark,
};

export function UiKittenProvider(props: PropsWithChildren): ReactNode {
  const colorScheme = useColorScheme() ?? 'light';

  const theme = useMemo(() => ({
    ...themes[colorScheme](),
    ...COMMON_THEME,
  }), [colorScheme]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />

      <ApplicationProvider
        {...eva}
        theme={theme as ThemeType}
        customMapping={customMapping as any}
      >
        {props.children}
      </ApplicationProvider>
    </>
  );
}
