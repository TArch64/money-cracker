import { type RefObject, useEffect, useRef } from 'react';
import { useNavigation } from 'expo-router';

type Off = () => void;
type MaybeOff = Off | undefined;

export function useInitialScreen(): RefObject<boolean> {
  const navigation = useNavigation();
  const isInitialScreen = useRef(true);

  useEffect(() => {
    let off: MaybeOff = navigation.addListener('state', (event) => {
      if (event.data.state.index !== 0) {
        isInitialScreen.current = false;
        off?.();
        off = undefined;
      }
    });

    return () => off?.();
  }, []);

  return isInitialScreen;
}
