import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/uiKitten';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [isDatabaseReady]);

  return (
    <DatabaseProvider onReady={() => setDatabaseReady(true)}>
      <UiKittenProvider>
        <Stack />
        <StatusBar style="auto" />
      </UiKittenProvider>
    </DatabaseProvider>
  );
}
