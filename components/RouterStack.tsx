import { type ReactNode, type RefObject, useEffect, useRef } from 'react';
import { Stack, useNavigation } from 'expo-router';

type Off = () => void;
type MaybeOff = Off | undefined;

function useInitialScreen(): RefObject<boolean> {
  const navigation = useNavigation()
  const isInitialScreen = useRef(true);

  useEffect(() => {
    let off: MaybeOff = navigation.addListener('state', (event) => {
      if (event.data.state.index !== 0) {
        isInitialScreen.current = false;
        off?.();
        off = undefined;
      }
    })

    return () => off?.()
  }, []);

  return isInitialScreen;
}

export function RouterStack(): ReactNode {
  const isInitialScreen = useInitialScreen();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="records/list"
        options={() => ({
          animation: isInitialScreen.current ? 'fade' : 'default',
          animationDuration: 200
        })}
      />

      <Stack.Screen
        name="records/intro"
        options={{ animation: 'fade', animationDuration: 200 }}
      />
    </Stack>
  );
}
