import { type ReactElement, type ReactNode, useRef } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from './MainScreenLayout';
import { type ITabMonthSliderRef, TabMonthSlider } from './TabMonthSlider';
import { Text, type TextProps } from '@ui-kitten/components';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { MonthIdx, useMonthStore } from '@/stores';
import type { IPropsWithChildrenFn } from '@/types';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface IAnimatedTitleProps extends Omit<TextProps, 'children'> {
  children: string;
}

const AnimatedTitle = (props: IAnimatedTitleProps): ReactNode => (
  <AnimatedText
    {...props}
    key={props.children}
    style={[props.style, { width: '100%' }]}
    entering={FadeIn.duration(300)}
    exiting={FadeOut.duration(300)}
  />
);

function HeaderSubtitle(props: TextProps): ReactNode {
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  return (
    <AnimatedTitle {...props}>
      {monthTitle}
    </AnimatedTitle>
  );
}

export interface ITabScreenLayoutProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement> {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  const sliderRef = useRef<ITabMonthSliderRef>(null);
  const scrollToToday = () => sliderRef.current?.scrollToIdx(MonthIdx.current());

  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}

      title={(txtProps) => (
        <Pressable style={{ width: '100%' }} onPress={scrollToToday}>
          <AnimatedTitle {...txtProps}>
            {props.title}
          </AnimatedTitle>
        </Pressable>
      )}

      subtitle={(txtProps) => (
        <Pressable style={{ width: '100%' }} onPress={scrollToToday}>
          <HeaderSubtitle {...txtProps} />
        </Pressable>
      )}
    >
      <TabMonthSlider ref={sliderRef} style={styles.slider}>
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
