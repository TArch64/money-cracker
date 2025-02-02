import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useMonthStore } from '@/stores';
import { useDateFormatter } from '@/hooks/formatters';
import { Text, useTheme } from '@ui-kitten/components';
import { Icon, IconName } from '@/components/uiKitten';
import Animated, { interpolate, type SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { interpolateColor } from 'react-native-reanimated/src';

export const HOME_TITLE_HEIGHT = 37;

export interface IHomeTitleProps {
  stickyProgress: SharedValue<number>;
}

export function HomeTitle(props: IHomeTitleProps): ReactNode {
  const theme = useTheme();
  const activeIdx = useMonthStore((state) => state.activeIdx);
  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const monthTitle = dateFormatter.format(activeIdx.date);

  const animatedStyle = useAnimatedStyle((): ViewStyle => props.stickyProgress.value < 0 ? {
    transform: [
      { translateX: -6 },
      { scale: interpolate(props.stickyProgress.value, [0, -1], [1, 1.1]) },
    ],
  } : {
    backgroundColor: interpolateColor(
      props.stickyProgress.value,
      [0, 1],
      [theme['background-basic-color-2'], theme['background-basic-color-1']],
    ),

    borderWidth: interpolate(props.stickyProgress.value, [0, 1], [0, 1]),

    transform: [
      { translateX: -6 - props.stickyProgress.value },
      { scale: interpolate(props.stickyProgress.value, [0, 1], [1, 0.8]) },
    ],
  });

  return (
    <Link href="/month/switcher">
      <Animated.View
        style={[
          styles.row,
          animatedStyle,
          { borderColor: theme['color-basic-500'] },
        ] satisfies StyleProp<ViewStyle>}
      >
        <Text category="h1">
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
  } satisfies TextStyle,
});
