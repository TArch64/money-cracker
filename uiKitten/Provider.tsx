import type { PropsWithChildren, ReactNode } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

export function UiKittenProvider(props: PropsWithChildren): ReactNode {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          {props.children}
        </ApplicationProvider>
      </>
    )
}
