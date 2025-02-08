import { type FC, type ReactNode, Suspense } from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  HOME_TITLE_HEIGHT,
  HomeAddRecord,
  HomeBalance,
  HomeGoals,
  HomeMonthStatistic,
  HomeRecentRecords,
  HomeSettings,
  HomeTitle,
} from '@/components/home';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const sections: FC[] = [
  HomeBalance,
  HomeMonthStatistic,
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

  return (
    <Animated.ScrollView
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}

      style={{
        backgroundColor: theme['background-basic-color-2'],
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
      } satisfies StyleProp<ViewStyle>}

      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: 80 },
      ] satisfies StyleProp<ViewStyle>}

      onScroll={scrollHandler}
    >
      <HomeTitle stickyProgress={stickyProgress} />

      {sections.map((Section, idx) => (
        <Suspense key={idx}>
          <Section />
        </Suspense>
      ))}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: 16,
  } satisfies ViewStyle,
});
