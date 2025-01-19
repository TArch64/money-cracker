import type { PropsWithChildren, ReactNode } from 'react';
import { type LayoutChangeEvent, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface IAnimatedHeightTransitionProps extends PropsWithChildren {
  transition?: (value: number) => number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedHeight(props: IAnimatedHeightTransitionProps): ReactNode {
  const height = useSharedValue(0);

  const transition = props.transition ?? ((value) => withSpring(value, {
    duration: 500,
    dampingRatio: 0.9,
  }));

  function onLayout(event: LayoutChangeEvent): void {
    const newHeight = event.nativeEvent.layout.height;
    height.value = height.value ? transition(newHeight) : newHeight;
  }

  const animatedStyle = useAnimatedStyle(() => !height.value ? {} : {
    height: height.value,
  });

  return (
    <Animated.View style={[props.style, styles.container, animatedStyle]}>
      <View onLayout={onLayout}>
        {props.children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  } satisfies ViewStyle,
});
