import type { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@ui-kitten/components';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Icon, IconName } from '@/components/uiKitten/Icon';

function renderIcon(name: IconName): BottomTabNavigationOptions['tabBarIcon'] {
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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        headerShown: false,
        animation: 'shift',
      }}
    >
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: renderIcon(IconName.LIST),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: renderIcon(IconName.BRIEFCASE_OUTLINE),
        }}
      />
    </Tabs>
  );
}
