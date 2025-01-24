import { type PropsWithChildren, type ReactNode, useRef, useState } from 'react';
import Swipeable, { type SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { type ElementStatus, IconName, iconRenderer } from './uiKitten';
import { Button, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { type SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface ISwipeAction {
  icon: IconName;
  status: ElementStatus;
  onAction: () => void;
}

interface ISwipeActionProps {
  action: ISwipeAction;
  dragged: SharedValue<number>;
  swipeable: SwipeableMethods;
  side: 'left' | 'right';
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

function SwipeAction(props: ISwipeActionProps): ReactNode {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const sideModifier = props.side === 'left' ? 1 : -1;

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{
      translateX: props.dragged.value
        - (sideModifier * width)
        - (sideModifier * Math.max((Math.abs(props.dragged.value) * 1.5) - width, 0) / 5),
    }],
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
    <View
      style={[
        styles.action,
        !width && { opacity: 0 },
      ] satisfies StyleProp<ViewStyle>}

      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      <AnimatedButton
        style={[
          styles.actionButton,
          styles[`action:${props.side}`],
          buttonAnimatedStyle,
        ]}

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
    </View>
  );
}

export interface ISwipeActionViewProps extends PropsWithChildren {
  left?: ISwipeAction;
  right: ISwipeAction;
  rowStyle?: StyleProp<ViewStyle>;
}

export function SwipeActionView(props: ISwipeActionViewProps): ReactNode {
  const swipeable = useRef<SwipeableMethods>(null);

  function onSwipeableOpen(direction: 'left' | 'right'): void {
    swipeable.current?.close();
    const action = direction === 'right' ? props.right : props.left;
    action?.onAction();
  }

  return (
    <Swipeable
      ref={swipeable}
      overshootFriction={2}
      leftThreshold={50}
      rightThreshold={50}
      enableTrackpadTwoFingerGesture
      childrenContainerStyle={props.rowStyle}

      renderLeftActions={props.left ? ((_, dragged, swipeable) => (
        <SwipeAction
          side="left"
          action={props.left!}
          dragged={dragged}
          swipeable={swipeable}
        />
      )) : undefined}

      renderRightActions={(_, dragged, swipeable) => (
        <SwipeAction
          side="right"
          action={props.right}
          dragged={dragged}
          swipeable={swipeable}
        />
      )}

      onSwipeableWillOpen={onSwipeableOpen}
    >
      {props.children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  action: {
    position: 'relative',
    display: 'flex',
  } satisfies ViewStyle,

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
    flex: 1,
    borderRadius: 0,
    zIndex: 1,
    minWidth: 0,
  } satisfies ViewStyle,

  actionOvershoot: {
    height: '100%',
    position: 'absolute',
    top: 0,
    zIndex: 0,
  } satisfies ViewStyle,
});
