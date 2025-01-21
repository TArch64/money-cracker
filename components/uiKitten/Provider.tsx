import { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { useColorScheme } from 'react-native';

export function UiKittenProvider(props: PropsWithChildren): ReactNode {
  const colorScheme = useColorScheme() ?? 'light';

  const theme = useMemo(() => colorScheme === 'light' ?
    {
      ...eva.light,
      'color-success-500': '#22c55e',
      'color-danger-500': '#ef4444',
      'background-basic-color-2': '#f8fafc',
    }
    : eva.dark, [colorScheme]);

  return (
      <>
        <IconRegistry icons={EvaIconsPack} />

        <ApplicationProvider {...eva} theme={theme}>
          {props.children}
        </ApplicationProvider>
      </>
    )
}
