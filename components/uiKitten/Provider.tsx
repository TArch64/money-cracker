import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry, type Theme, type ThemeType } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useColorScheme } from 'react-native';

type ColorScheme = 'light' | 'dark';

const COMMON_THEME: Partial<Theme> = {
  'color-success-500': '#22c55e',
  'color-danger-500': '#ef4444',
  'box-shadow': '0 0 10px rgba(0, 0, 0, 0.1)',
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

        <ApplicationProvider {...eva} theme={theme as ThemeType}>
          {props.children}
        </ApplicationProvider>
      </>
    )
}
