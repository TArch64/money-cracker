import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { Text, useTheme } from '@ui-kitten/components';
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { interpolateColor } from 'react-native-reanimated/src';
import { useMonthStore } from '@/stores';
import { useDateFormatter } from '@/hooks/formatters';
import { Icon, IconName } from '@/components/uiKitten';

export const HOME_TITLE_HEIGHT = 37;

export interface IHomeTitleProps {
  stickyProgress: SharedValue<number>;
}

export function HomeTitle(props: IHomeTitleProps): ReactNode {
  const theme = useTheme();
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  const animatedStyle = useAnimatedStyle((): ViewStyle => ({
    transform: [
      { translateX: -6 - Math.max(props.stickyProgress.value, 0) },
      { translateY: interpolate(Math.min(props.stickyProgress.value, 0), [0, -1], [0, -12]) },
      { scale: interpolate(props.stickyProgress.value, [-1, 0, 1], [1.1, 1, 0.8]) },
    ],

    borderWidth: interpolate(Math.max(props.stickyProgress.value, 0), [0, 1], [0, 1]),

    backgroundColor: interpolateColor(
      Math.max(props.stickyProgress.value, 0),
      [0, 1],
      [theme['background-basic-color-2'], theme['background-basic-color-1']],
    ),
  }));

  return (
    <Link href="/month/switcher">
      <Animated.View
        style={[
          styles.row,
          animatedStyle,
          { borderColor: theme['color-basic-500'] },
        ] satisfies StyleProp<ViewStyle>}
      >
        <Text category="h1" style={styles.title}>
          {monthTitle}
        </Text>

        <Icon
          name={IconName.CHEVRON_DOWN}
          style={{ width: 28, height: 28 }}
        />
      </Animated.View>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    paddingLeft: 10,
    borderRadius: 8,
    borderStyle: 'solid',
    transformOrigin: 'left',
  } satisfies ViewStyle,

  title: {
    textTransform: 'capitalize',
  } satisfies TextStyle,
});
