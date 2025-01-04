import type { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { Icon, useTheme } from '@ui-kitten/components';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

function renderIcon(name: string): BottomTabNavigationOptions['tabBarIcon'] {
  return ({ size, color }) => (
    <Icon name={name} fill={color} style={{ width: size, height: size }} />
  );
}

export default function Layout(): ReactNode {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme['color-primary-500'],
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: renderIcon('list'),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budget',
          tabBarIcon: renderIcon('briefcase-outline'),
        }}
      />
    </Tabs>
  );
}
