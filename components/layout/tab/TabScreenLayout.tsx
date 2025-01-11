import { type PropsWithChildren, type ReactNode, useRef } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from '../MainScreenLayout';
import { TabHeaderTitle } from './TabHeaderTitle';
import { type IMonthSwitcherRef, MonthSwitcher } from './MonthSwitcher';

export interface ITabScreenLayoutProps extends PropsWithChildren {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  const monthSwitcherRef = useRef<IMonthSwitcherRef>(null);

  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}

      title={(txtProps) => (
        <TabHeaderTitle
          {...txtProps}
          onPress={() => monthSwitcherRef.current?.open()}
        />
      )}
    >
      <MonthSwitcher ref={monthSwitcherRef} />
      {props.children}
    </MainScreenLayout>
  );
}
