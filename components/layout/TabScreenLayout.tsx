import { type ReactElement, type ReactNode, useRef } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from './MainScreenLayout';
import { TabMonthSlider } from './TabMonthSlider';
import { Text, type TextProps } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { MonthIdx, useMonthStore } from '@/stores';
import type { IPropsWithChildrenFn } from '@/types';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface IAnimatedTitleProps extends Omit<TextProps, 'children'> {
  children: string;
  initial: boolean;
}

const AnimatedTitle = ({ initial, ...props }: IAnimatedTitleProps): ReactNode => (
  <AnimatedText
    {...props}
    key={props.children}
    entering={initial ? undefined : FadeInLeft.duration(200).delay(100)}
    exiting={FadeOutRight.duration(200)}
  />
);

export interface ITabScreenLayoutProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement> {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  const isInitialIdx = useRef(true);
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  function onActiveMonthChange() {
    isInitialIdx.current = false;
  }

  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}

      title={(txtProps) => (
        <AnimatedTitle {...txtProps} initial={isInitialIdx.current}>
          {props.title}
        </AnimatedTitle>
      )}

      subtitle={(txtProps) => (
        <AnimatedTitle{...txtProps} initial={isInitialIdx.current}>
          {monthTitle}
        </AnimatedTitle>
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
