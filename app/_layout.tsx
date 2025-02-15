import 'react-native-reanimated';

import { type ReactNode, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { documentDirectory } from 'expo-file-system';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { useTheme } from '@ui-kitten/components';
import { Stack } from 'expo-router';
import type { ViewStyle } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { useInitialScreen } from '@/hooks/useInitialScreen';
import { QueryProvider } from '@/hooks/queries';
import { UiKittenProvider } from '@/components/uiKitten';
import { DatabaseProvider } from '@/db';
import { I18NProvider } from '@/locale';

if (__DEV__) {
  console.log('SQLite database path:');
  console.log(`${documentDirectory}SQLite/app.db`);
}

SplashScreen.preventAutoHideAsync();
configureReanimatedLogger({ strict: false });

function StackRoot(): ReactNode {
  const theme = useTheme();
  const isInitialScreen = useInitialScreen();

  return (
    <Stack
      screenOptions={() => ({
        headerShown: false,
        animation: isInitialScreen.current ? 'fade' : 'default',
        animationDuration: 100,
        freezeOnBlur: true,

        contentStyle: {
          backgroundColor: theme['background-basic-color-2'],
        } satisfies ViewStyle,
      })}
    >
      <Stack.Screen
        name="month/switcher"
        options={{ presentation: 'modal' }}
      />
    </Stack>
  );
}

export default function Layout() {
  const [isDatabaseReady, setDatabaseReady] = useState(false);

  useEffect(() => {
    if (isDatabaseReady) {
      SplashScreen.hideAsync();
    }
  }, [isDatabaseReady]);

  return (
    <DatabaseProvider onReady={() => setDatabaseReady(true)}>
      {() => (
        <UiKittenProvider>
          <QueryProvider>
            <I18NProvider>
              {() => (
                <SafeAreaProvider>
                  <GestureHandlerRootView>
                    <ActionSheetProvider>
                      <>
                        <StatusBar style="auto" />
                        <StackRoot />
                      </>
                    </ActionSheetProvider>
                  </GestureHandlerRootView>
                </SafeAreaProvider>
              )}
            </I18NProvider>
          </QueryProvider>
        </UiKittenProvider>
      )}
    </DatabaseProvider>
  );
}
