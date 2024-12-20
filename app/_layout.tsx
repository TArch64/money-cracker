import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/uiKitten';
import { QueryProvider } from '@/queries';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [isDatabaseReady]);

  return (
    <DatabaseProvider
      onReady={() => setDatabaseReady(true)}
      children={() => (
        <UiKittenProvider>
          <StatusBar style="auto" />
          <QueryProvider>
            <Stack />
          </QueryProvider>
        </UiKittenProvider>
      )}
    />
  );
}
