import 'react-native-reanimated';

import { type ReactNode, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { DatabaseProvider } from '@/db';
import { UiKittenProvider } from '@/components/uiKitten';
import { QueryProvider } from '@/hooks/queries';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { documentDirectory } from 'expo-file-system';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { configureReanimatedLogger } from 'react-native-reanimated';
import { useTheme } from '@ui-kitten/components';
import { useInitialScreen } from '@/hooks/useInitialScreen';
import { Stack } from 'expo-router';
import type { ViewStyle } from 'react-native';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';

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
        animationDuration: 200,
        freezeOnBlur: true,

        contentStyle: {
          backgroundColor: theme['background-basic-color-2'],
        } satisfies ViewStyle,
      })}
    >
      <Stack.Screen
        name="modals/switch-month"
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
          </QueryProvider>
        </UiKittenProvider>
      )}
    </DatabaseProvider>
  );
}
