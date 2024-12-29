import 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/uiKitten';
import { QueryProvider } from '@/queries';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { documentDirectory } from 'expo-file-system';
import { ClickOutsideProvider } from 'react-native-click-outside';

if (__DEV__) {
  console.log('SQLite database path:');
  console.log(`${documentDirectory}SQLite/app.db`);
}

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const route = usePathname();
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    if (route !== '/') {
      SplashScreen.hideAsync();
    }
  }, [isDatabaseReady]);

  return (
    <DatabaseProvider onReady={() => setDatabaseReady(true)}>
      {() => (
        <UiKittenProvider>
          <ClickOutsideProvider>
            <StatusBar style="auto" />
            <QueryProvider>
              <SafeAreaProvider>
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen
                    name="records/list"
                    options={{
                      animation: 'none',
                    }}
                  />
                </Stack>
              </SafeAreaProvider>
            </QueryProvider>
          </ClickOutsideProvider>
        </UiKittenProvider>
      )}
    </DatabaseProvider>
  );
}
