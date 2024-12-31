import type { PropsWithChildren, ReactNode } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const theme = {
  ...eva.light,
  'color-success-500': '#22c55e',
  'color-danger-500': '#ef4444',
  'background-basic-color-2': '#f8fafc',
};

export function UiKittenProvider(props: PropsWithChildren): ReactNode {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={theme}>
          {props.children}
        </ApplicationProvider>
      </>
    )
}
