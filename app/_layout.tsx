import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/uiKitten';
import { QueryProvider } from '@/queries';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { documentDirectory } from 'expo-file-system';

if (__DEV__) {
  console.log('SQLite database path:');
  console.log(`${documentDirectory}SQLite/app.db`.replace('file://', ''));
}

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    SplashScreen.hideAsync();
  }, [isDatabaseReady]);

  return (
    <DatabaseProvider onReady={() => setDatabaseReady(true)}>
      {() => (
        <UiKittenProvider>
          <StatusBar style="auto" />
          <QueryProvider>
            <SafeAreaProvider>
              <Stack />
            </SafeAreaProvider>
          </QueryProvider>
        </UiKittenProvider>
      )}
    </DatabaseProvider>
  );
}
