import 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { Stack, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/components/uiKitten';
import { QueryProvider } from '@/hooks/queries';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { documentDirectory } from 'expo-file-system';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useInitialScreen } from '@/hooks/useInitialScreen';

if (__DEV__) {
  console.log('SQLite database path:');
  console.log(`${documentDirectory}SQLite/app.db`);
}

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const route = usePathname();
  const isInitialScreen = useInitialScreen();
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
            <QueryProvider>
              <SafeAreaProvider>
                <GestureHandlerRootView>
                  <BottomSheetModalProvider>
                    <StatusBar style="auto" />

                    <Stack
                      screenOptions={() => ({
                        headerShown: false,
                        animation: isInitialScreen.current ? 'fade' : 'default',
                        animationDuration: 200,
                      })}
                    />
                  </BottomSheetModalProvider>
                </GestureHandlerRootView>
              </SafeAreaProvider>
            </QueryProvider>
          </ClickOutsideProvider>
        </UiKittenProvider>
      )}
    </DatabaseProvider>
  );
}
