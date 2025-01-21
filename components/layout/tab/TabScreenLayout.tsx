import { type PropsWithChildren, type ReactNode, Suspense } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from '../MainScreenLayout';
import { TabHeaderTitle } from './TabHeaderTitle';

export interface ITabScreenLayoutProps extends PropsWithChildren {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export const TabScreenLayout = (props: ITabScreenLayoutProps): ReactNode => (
  <MainScreenLayout
    canGoBack={false}
    headerRight={props.headerRight}
    title={(txtProps) => <TabHeaderTitle {...txtProps} />}
  >
    <Suspense>
      {props.children}
    </Suspense>
  </MainScreenLayout>
);
