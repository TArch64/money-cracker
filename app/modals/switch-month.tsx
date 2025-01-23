import { type ReactNode, Suspense } from 'react';
import { TopNavigation, TopNavigationAction, useTheme } from '@ui-kitten/components';
import { IconName, iconRenderer } from '@/components/uiKitten';
import { SwitcherYearList } from '@/components/monthSwitcher';
import { useRouter } from 'expo-router';
import { type StyleProp, View, type ViewStyle } from 'react-native';

export default function SwitchMonth(): ReactNode {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        height: '100%',
        backgroundColor: theme['background-basic-color-1'],
      } satisfies StyleProp<ViewStyle>}
    >
      <TopNavigation
        title="Select Month"
        alignment="center"

        accessoryLeft={() => (
          <TopNavigationAction
            icon={iconRenderer(IconName.ARROW_BACK)}
            onPress={() => router.back()}
          />
        )}
      />

      <Suspense>
        <SwitcherYearList />
      </Suspense>
    </View>
  );
}
