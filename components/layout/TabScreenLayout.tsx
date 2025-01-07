import { type ReactElement, type ReactNode, useRef } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from './MainScreenLayout';
import { TabMonthSlider } from './TabMonthSlider';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { MonthIdx, useMonthStore } from '@/stores';
import type { IPropsWithChildrenFn } from '@/types';

export interface ITabScreenLayoutProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement> {
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  const isInitialIdx = useRef(true);
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const title = dateFormatter.format(activeIdx.date);

  function onActiveMonthChange() {
    isInitialIdx.current = false;
  }

  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}

      title={(txtProps) => (
        <AnimatedText
          {...txtProps}
          key={title}
          entering={isInitialIdx.current ? undefined : FadeInLeft.duration(200).delay(100)}
          exiting={FadeOutRight.duration(200)}
        >
          {title}
        </AnimatedText>
      )}
    >
      <TabMonthSlider style={styles.slider} onChange={onActiveMonthChange}>
        {props.children}
      </TabMonthSlider>
    </MainScreenLayout>
  );
}

const styles = StyleSheet.create({
  slider: {
    height: '100%',
  } satisfies ViewStyle,
});
