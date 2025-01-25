import { type PropsWithChildren, type ReactNode, useRef, useState } from 'react';
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { type ElementStatus, IconName, iconRenderer } from './uiKitten';
import { Button, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, {
  runOnJS,
  type SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { impactAsync, ImpactFeedbackStyle } from 'expo-haptics';

const enum Side {
  LEFT = 'left',
  RIGHT = 'right',
}

export interface ISwipeAction {
  icon: IconName;
  status: ElementStatus;
  onAction: () => void;
}

interface ISwipeActionProps {
  action: ISwipeAction;
  size: number;
  progress: SharedValue<number>;
  dragged: SharedValue<number>;
  swipeable: SwipeableMethods;
  side: Side;
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

function SwipeAction(props: ISwipeActionProps): ReactNode {
  const theme = useTheme();
  const sideModifier = props.side === Side.LEFT ? 1 : -1;
  const scale = useSharedValue(0.7);

  function vibrate() {
    impactAsync(ImpactFeedbackStyle.Medium);
  }

  useAnimatedReaction(() => props.progress.value, (progress, previous) => {
    if (progress >= 1 && (previous || 0) < 1) {
      scale.value = withSpring(1);
      runOnJS(vibrate)();
    }

    if (progress < 1 && (previous || 0) >= 1) {
      scale.value = withSpring(0.7);
    }
  });

  const buttonAnimatedStyle = useAnimatedStyle((): ViewStyle => ({
    transform: [
      { translateX: props.dragged.value - (sideModifier * props.size) },
      { scale: scale.value },
    ],
  }));

  const overshootAnimatedStyle = useAnimatedStyle(() => ({
    [props.side]: 0,
    width: sideModifier * props.dragged.value,
  }));

  function onPress(): void {
    props.swipeable.close();
    props.action.onAction();
  }

  return (
    <>
      <AnimatedButton
        style={[
          styles.actionButton,
          styles[`action:${props.side}`],
          buttonAnimatedStyle,
          { width: props.size, height: props.size },
        ] satisfies StyleProp<ViewStyle>}

        status={props.action.status}
        accessoryLeft={iconRenderer(props.action.icon, { marginHorizontal: 0 })}
        onPress={onPress}
      />

      <Animated.View
        style={[
          styles.actionOvershoot,
          styles[`action:${props.side}`],
          { backgroundColor: theme[`color-${props.action.status}-500`] },
          overshootAnimatedStyle,
        ] satisfies StyleProp<ViewStyle>}
      />
    </>
  );
}

export interface ISwipeActionViewProps extends PropsWithChildren {
  left?: ISwipeAction;
  right: ISwipeAction;
  rowStyle?: StyleProp<ViewStyle>;
}

export function SwipeActionView(props: ISwipeActionViewProps): ReactNode {
  const swipeable = useRef<SwipeableMethods>(null);
  const [height, setHeight] = useState(0);

  function onSwipeableOpen(direction: 'left' | 'right'): void {
    swipeable.current?.close();
    props[direction]?.onAction();
  }

  function actionRenderer(side: Side) {
    if (!props[side] || !height) {
      return;
    }

    return (progress: SharedValue<number>, dragged: SharedValue<number>, swipeable: SwipeableMethods) => (
      <SwipeAction
        side={side}
        action={props[side]!}
        size={height}
        progress={progress}
        dragged={dragged}
        swipeable={swipeable}
      />
    );
  }

  return (
    <View onLayout={event => setHeight(event.nativeEvent.layout.height)}>
      <Swipeable
        ref={swipeable}
        overshootFriction={2}
        leftThreshold={50}
        rightThreshold={50}
        enableTrackpadTwoFingerGesture
        childrenContainerStyle={props.rowStyle}
        renderLeftActions={actionRenderer(Side.LEFT)}
        renderRightActions={actionRenderer(Side.RIGHT)}
        onSwipeableWillOpen={onSwipeableOpen}
      >
        {props.children}
      </Swipeable>
    </View>
  );
}

const styles = StyleSheet.create({
  'action:left': {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  } satisfies ViewStyle,

  'action:right': {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  } satisfies ViewStyle,

  actionButton: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    zIndex: 1,
  } satisfies ViewStyle,

  actionOvershoot: {
    height: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 0,
  } satisfies ViewStyle,
});
