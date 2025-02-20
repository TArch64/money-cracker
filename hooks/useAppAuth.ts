import { useMemo } from 'react';
import { authenticateAsync, hasHardwareAsync, isEnrolledAsync } from 'expo-local-authentication';
import { newSecureStoreKey, useSecureStore } from './useSecureStore';

export interface IAppAuthData {
  enabled: boolean;
  password: string;
}

const STORAGE_KEY = newSecureStoreKey<IAppAuthData>('app-auth');

export interface IAppAuth {
  enable: (data: Omit<IAppAuthData, 'enabled'>) => Promise<void>;
  isEnabled: () => Promise<boolean>;
  isHardwareAvailable: () => Promise<boolean>;
  authHardware: () => Promise<boolean>;
  authPassword: (password: string) => Promise<boolean>;
}

export function useAppAuth(): IAppAuth {
  const secureStore = useSecureStore();

  return useMemo((): IAppAuth => ({
    enable: (data) => secureStore.setObject(STORAGE_KEY, { enabled: true, ...data }),
    isHardwareAvailable: hasHardwareAsync,

    async isEnabled() {
      if (__DEV__) return false;
      return (await secureStore.getObject(STORAGE_KEY))?.enabled === true;
    },

    async authHardware() {
      return await isEnrolledAsync() || (await authenticateAsync()).success;
    },

    async authPassword(password) {
      return (await secureStore.getObject(STORAGE_KEY))?.password === password;
    },
  }), []);
}
