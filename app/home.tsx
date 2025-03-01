import { type FC, type ReactNode, Suspense } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  HOME_TITLE_HEIGHT,
  HomeAddRecord,
  HomeBalance,
  HomeGoals,
  HomeImportPhoto,
  HomeMonthStatistic,
  HomeRecentRecords,
  HomeSettings,
  HomeTitle,
} from '@/components/home';

const sections: FC[] = [
  HomeBalance,
  HomeMonthStatistic,
  HomeImportPhoto,
  HomeAddRecord,
  HomeGoals,
  HomeRecentRecords,
  HomeSettings,
];

export default function Home(): ReactNode {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const stickyProgress = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const value = event.contentOffset.y;
    const progress = value / HOME_TITLE_HEIGHT;
    stickyProgress.value = Math.min(1, Math.max(-1, progress));
  });

  const listAnimatedStyle = useAnimatedStyle((): ViewStyle => ({
    gap: 16 + (stickyProgress.value >= 0 ? 0 : interpolate(stickyProgress.value, [0, -1], [0, 4])),
  }));

  return (
    <Animated.ScrollView
      removeClippedSubviews
      stickyHeaderIndices={[0]}

      style={{
        backgroundColor: theme['background-basic-color-2'],
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
      } satisfies StyleProp<ViewStyle>}

      contentContainerStyle={[
        { paddingBottom: 80 },
      ] satisfies StyleProp<ViewStyle>}

      onScroll={scrollHandler}
    >
      <HomeTitle stickyProgress={stickyProgress} />

      <Animated.View style={[styles.list, listAnimatedStyle]}>
        {sections.map((Section, idx) => (
          <Suspense key={idx}>
            <Section />
          </Suspense>
        ))}
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    paddingTop: 16,
  } satisfies ViewStyle,
});
