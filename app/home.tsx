import { type FC, type ReactNode, Suspense } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeBalance, HomeTitle } from '@/components/home';

const sections: FC[] = [
  HomeBalance,
];

export default function Home(): ReactNode {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      removeClippedSubviews
      showsVerticalScrollIndicator
      stickyHeaderIndices={[0]}

      contentContainerStyle={{
        backgroundColor: theme['background-basic-color-2'],
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        paddingLeft: insets.left + 12,
        paddingRight: insets.right + 12,
        gap: 20,
      } satisfies StyleProp<ViewStyle>}
    >
      <HomeTitle />

      {sections.map((Section, idx) => (
        <Suspense key={idx}>
          <Section />
        </Suspense>
      ))}
    </ScrollView>
  );
}


