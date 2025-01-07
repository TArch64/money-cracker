import type { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@ui-kitten/components';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Icon, IconName } from '@/components/uiKitten/Icon';
import { type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function iconRenderer(name: IconName): BottomTabNavigationOptions['tabBarIcon'] {
  return ({ size, color }) => (
    <Icon
      name={name}
      fill={color}
      style={{ width: size, height: size }}
    />
  );
}

export default function Layout(): ReactNode {
  const theme = useTheme();
  const safeArea = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        headerShown: false,
        animation: 'shift',

        tabBarStyle: {
          height: safeArea.bottom + 56,
        } satisfies ViewStyle,

        tabBarItemStyle: {
          paddingTop: 10,
        } satisfies ViewStyle,
      }}
    >
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: iconRenderer(IconName.LIST),
        }}
      />

      <Tabs.Screen
        name="statistics"
        options={{
          title: 'Statistics',
          tabBarIcon: iconRenderer(IconName.PIE_CHART_OUTLINE),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: iconRenderer(IconName.BRIEFCASE_OUTLINE),
        }}
      />
    </Tabs>
  );
}
