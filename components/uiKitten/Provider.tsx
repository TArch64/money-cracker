import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, type Theme, type ThemeType } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useColorScheme } from 'react-native';
import customMapping from './mapping.json';

type ColorScheme = 'light' | 'dark';

// Colors: https://developer.apple.com/design/human-interface-guidelines/color#iOS-iPadOS-system-colors
const COMMON_THEME: Partial<Theme> = {
  'color-success-500': '#34c759',
  'color-primary-500': '#007aff',
  'color-danger-500': '#ff3b30',
  'box-shadow-1': '0 0 5px rgba(0, 0, 0, 0.1)',
  'box-shadow-2': '0 0 10px rgba(0, 0, 0, 0.1)',
};

const themes: Record<ColorScheme, () => Theme> = {
  light: () => ({
    ...eva.light,
    'color-success-600': '#248a3d',
    'color-primary-600': '#0040dd',
    'color-danger-600': '#d70015',
    'background-basic-color-2': '#f8fafc',
  }),

  dark: () => ({
    ...eva.dark,
    'color-success-600': '#30db5b',
    'color-primary-600': '#409cff',
    'color-danger-600': '#ff6961',
  }),
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
    )
}
