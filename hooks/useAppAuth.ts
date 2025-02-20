import { useMemo } from 'react';
import { authenticateAsync, hasHardwareAsync } from 'expo-local-authentication';
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
    isEnabled: async () => (await secureStore.getObject(STORAGE_KEY))?.enabled === true,
    isHardwareAvailable: () => hasHardwareAsync(),

    async authHardware() {
      const data = await secureStore.getObject(STORAGE_KEY);
      if (!data) return false;
      const result = await authenticateAsync();
      return result.success;
    },

    async authPassword(password) {
      const data = await secureStore.getObject(STORAGE_KEY);
      if (!data) return false;
      return data.password === password;
    },
  }), []);
}
