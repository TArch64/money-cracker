import type { ReactNode } from 'react';
import { ScrollView, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { IPropsWithChildrenFn } from '@/types';

export interface IAnimatedHeightContext {
  update: (width: number, height: number) => void;
}

export interface IAnimatedHeightTransitionProps {
  transition?: (value: number) => number;
  style?: StyleProp<ViewStyle>;
  children: IPropsWithChildrenFn<[ctx: IAnimatedHeightContext]>['children'] | ReactNode;
}

export function AnimatedHeight(props: IAnimatedHeightTransitionProps): ReactNode {
  const height = useSharedValue(0);

  const transition = props.transition ?? ((value) => withSpring(value, {
    duration: 500,
    dampingRatio: 0.9,
  }));

  function onContentSizeChange(_: number, h: number): void {
    height.value = height.value ? transition(h) : h;
  }

  const animatedStyle = useAnimatedStyle(() => !height.value ? {} : {
    height: height.value,
  });

  return (
    <Animated.View style={[props.style, styles.container, animatedStyle]}>
      {typeof props.children === 'function' ? props.children({ update: onContentSizeChange }) : (
        <ScrollView scrollEnabled={false} onContentSizeChange={onContentSizeChange}>
          {props.children}
        </ScrollView>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  } satisfies ViewStyle,
});
