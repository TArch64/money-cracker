import { useMemo } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

export type SecureStoreKey<V> = string & { __v: V };
export const newSecureStoreKey = <V>(key: string) => key as SecureStoreKey<V>;

export interface ISecureStore {
  getItem: (key: SecureStoreKey<string>) => Promise<string | null>;
  getObject: <V extends object>(key: SecureStoreKey<V>) => Promise<V | null>;
  setItem: (key: SecureStoreKey<string>, value: string) => Promise<void>;
  setObject: <V extends object>(key: SecureStoreKey<V>, value: V) => Promise<void>;
}

export function useSecureStore(): ISecureStore {
  return useMemo((): ISecureStore => ({
    getItem(key) {
      return getItemAsync(key, { requireAuthentication: false });
    },

    async getObject(key) {
      const raw = await this.getItem(key as unknown as SecureStoreKey<string>);
      return raw ? JSON.parse(raw) : null;
    },

    setItem(key, value) {
      return setItemAsync(key, value, { requireAuthentication: false });
    },

    setObject(key, value) {
      return this.setItem(key as unknown as SecureStoreKey<string>, JSON.stringify(value));
    },
  }), []);
}
