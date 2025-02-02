import type { ReactNode } from 'react';
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@ui-kitten/components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeTitle } from '@/components/home';

export default function Home(): ReactNode {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
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
    >
      <HomeTitle />
    </ScrollView>
  );
}


