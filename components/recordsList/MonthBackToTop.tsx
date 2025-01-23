import { type ReactNode } from 'react';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { Button } from '@ui-kitten/components';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

export interface IMonthBackToTopProps {
  visible: boolean;
  onPress: () => void;
}

const AnimatedButton = Animated.createAnimatedComponent(Button);

export const MonthBackToTop = (props: IMonthBackToTopProps): ReactNode => (
  <View style={styles.container}>
    {props.visible && (
      <AnimatedButton
        status="control"
        style={styles.button}

        entering={FadeInDown.springify(500).withInitialValues({
          opacity: 0,
          transform: [{ translateY: 25 }, { scale: 0.5 }],
        })}

        exiting={FadeOut.duration(200)}
        accessoryLeft={iconRenderer(IconName.ARROW_UPWARD)}
        onPress={props.onPress}
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    width: 0,
    marginLeft: -24,
    left: '50%',
  } as ViewStyle,

  button: {
    aspectRatio: 1,
    borderRadius: '100%',
    boxShadow: '0 0 6px rgba(0, 0, 0, 0.05)',
  } satisfies ViewStyle,
});
