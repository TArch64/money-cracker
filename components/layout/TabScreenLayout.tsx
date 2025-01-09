import { type MutableRefObject, type ReactElement, type ReactNode, useRef } from 'react';
import { type IMainScreenLayoutProps, MainScreenLayout } from './MainScreenLayout';
import { type ITabMonthSliderRef, TabMonthSlider } from './TabMonthSlider';
import { Text, type TextProps } from '@ui-kitten/components';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useDateFormatter } from '@/hooks/formatters';
import { MonthIdx, useMonthStore } from '@/stores';
import type { IPropsWithChildrenFn } from '@/types';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface IAnimatedTitleProps extends Omit<TextProps, 'children'> {
  children: string;
  initial: MutableRefObject<boolean>;
}

const AnimatedTitle = ({ initial, ...props }: IAnimatedTitleProps): ReactNode => (
  <AnimatedText
    {...props}
    key={props.children}
    entering={initial.current ? undefined : FadeInLeft.duration(200).delay(100)}
    exiting={FadeOutRight.duration(200)}
  />
);

interface IHeaderSubtitleProps extends TextProps {
  isInitialIdx: MutableRefObject<boolean>;
}

function HeaderSubtitle(props: IHeaderSubtitleProps): ReactNode {
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  return (
    <AnimatedTitle{...props} initial={props.isInitialIdx}>
      {monthTitle}
    </AnimatedTitle>
  );
}

export interface ITabScreenLayoutProps extends IPropsWithChildrenFn<[idx: MonthIdx], ReactElement> {
  title: string;
  headerRight?: IMainScreenLayoutProps['headerRight'];
}

export function TabScreenLayout(props: ITabScreenLayoutProps): ReactNode {
  const activateIdx = useMonthStore((state) => state.activateIdx);
  const isInitialIdx = useRef(true);

  function onActiveMonthChange() {
    isInitialIdx.current = false;
  }

  const sliderRef = useRef<ITabMonthSliderRef>(null);
  const scrollToToday = () => sliderRef.current?.scrollToIdx(MonthIdx.current());

  return (
    <MainScreenLayout
      canGoBack={false}
      headerRight={props.headerRight}

      title={(txtProps) => (
        <Pressable onPress={scrollToToday}>
          <AnimatedTitle {...txtProps} initial={isInitialIdx}>
            {props.title}
          </AnimatedTitle>
        </Pressable>
      )}

      subtitle={(txtProps) => (
        <Pressable onPress={scrollToToday}>
          <HeaderSubtitle
            {...txtProps}
            isInitialIdx={isInitialIdx}
          />
        </Pressable>
      )}
    >
      <TabMonthSlider
        ref={sliderRef}
        style={styles.slider}
        onChange={onActiveMonthChange}
      >
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
