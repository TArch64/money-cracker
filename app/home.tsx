import { type FC, type ReactNode, Suspense } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HOME_TITLE_HEIGHT, HomeBalance, HomeMonthStatistic, HomeTitle } from '@/components/home';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

const sections: FC[] = [
  HomeBalance,
  HomeMonthStatistic,
];

export default function Home(): ReactNode {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const stickyProgress = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    const value = event.contentOffset.y;

    if (stickyProgress.value !== HOME_TITLE_HEIGHT) {
      stickyProgress.value = value <= 0 ? 0 : Math.min(value, HOME_TITLE_HEIGHT) / HOME_TITLE_HEIGHT;
    }
  });

  return (
    <Animated.ScrollView
      removeClippedSubviews
      showsVerticalScrollIndicator
      stickyHeaderIndices={[0]}

      style={{
        backgroundColor: theme['background-basic-color-2'],
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
      } satisfies StyleProp<ViewStyle>}

      contentContainerStyle={{
        gap: 20,
      } satisfies StyleProp<ViewStyle>}

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


