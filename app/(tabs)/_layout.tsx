import type { ReactNode } from 'react';
import { Tabs } from 'expo-router';
import { useTheme } from '@ui-kitten/components';

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
        options={{ title: 'Records' }}
      />

      <Tabs.Screen
        name="budget"
        options={{ title: 'Budget' }}
      />
    </Tabs>
  );
}
