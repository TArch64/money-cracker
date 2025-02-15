import { type ReactNode, useLayoutEffect, useRef } from 'react';
import { Button, useTheme } from '@ui-kitten/components';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { IconName, iconRenderer } from '@/components/uiKitten';

export interface IMonthBackToTopProps {
  visible: boolean;
  onPress: () => void;
}

export const MonthBackToTop = (props: IMonthBackToTopProps): ReactNode => {
  const theme = useTheme();
  const progress = useSharedValue(0);
  const isInitial = useRef(true);

  useLayoutEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }

    progress.value = withSpring(props.visible ? 1 : 0, { duration: 100, dampingRatio: 0.9 });
  }, [props.visible]);

  const containerAnimatedStyle = useAnimatedStyle((): ViewStyle => ({
    opacity: progress.value,

    transform: [
      { translateX: '-50%' },
      { scale: 0.8 + (0.2 * progress.value) },
    ],
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Button
        status="control"

        style={[
          styles.button,
          { boxShadow: theme['box-shadow-2'] },
        ] satisfies StyleProp<ViewStyle>}

        accessoryLeft={iconRenderer(IconName.ARROW_UPWARD)}
        onPress={props.onPress}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    width: 40,
    left: '50%',
  } as ViewStyle,

  button: {
    aspectRatio: 1,
    borderRadius: '100%',
  } satisfies ViewStyle,
});
