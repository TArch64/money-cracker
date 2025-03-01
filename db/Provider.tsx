import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { randomUUID } from 'expo-crypto';
import type { IPropsWithChildrenFn } from '@/types';
import { newSecureStoreKey, useSecureStore } from '@/hooks/useSecureStore';
import * as schema from './schema';
import migrations from './migrations/migrations';

export type AppDatabase = ExpoSQLiteDatabase<typeof schema> & { $client: SQLiteDatabase };

const Context = createContext<AppDatabase>(null!);

export const useDatabase = () => useContext(Context);

interface IDatabaseInnerProviderProps extends IPropsWithChildrenFn {
  client: AppDatabase;
  onReady: () => void;
}

function DatabaseSeeds(props: IDatabaseInnerProviderProps): ReactNode {
  const [ready, setReady] = useState(!__DEV__);

  useEffect(() => {
    if (__DEV__) {
      // import('./seeds').then(async ({ runSeeds }) => {
      //   await runSeeds(props.client);
      setReady(true);
      props.onReady();
      // });
    }
  }, []);

  return ready ? props.children() : null;
}

function DatabaseMigrations(props: IDatabaseInnerProviderProps): ReactNode {
  const { success, error } = useMigrations(props.client, migrations);
  return !success && !error ? null : <DatabaseSeeds {...props} />;
}

export interface IDatabaseProviderProps extends IPropsWithChildrenFn {
  onReady: () => void;
}

const STORE_PRAGMA_KEY = newSecureStoreKey<string>('db-pragma-key');

export function DatabaseProvider(props: IDatabaseProviderProps): ReactNode {
  const secureStore = useSecureStore();
  const [client, setClient] = useState<AppDatabase | null>(null);

  async function getPragmaKey(): Promise<string> {
    let key = await secureStore.getItem(STORE_PRAGMA_KEY);
    if (key) return key;
    key = randomUUID();
    await secureStore.setItem(STORE_PRAGMA_KEY, key);
    return key;
  }

  useEffect(() => {
    let database: SQLiteDatabase;

    (async () => {
      try {
        database = await openDatabaseAsync('app.db');
        const key = await getPragmaKey();
        await database.execAsync(`PRAGMA key = '${key}';`);
        setClient(drizzle(database, { schema, logger: __DEV__ }));

        if (__DEV__) {
          console.log('SQLite database path:');
          console.log(database.databasePath);
        }
      } catch (error) {
        console.error('Failed to open database', error);
      }
    })();

    return () => {
      try {
        database?.closeSync();
      } catch (error) {
        console.error('Failed to close database', error);
      }
    };
  }, []);

  if (!client) {
    return null;
  }

  return (
    <Context.Provider value={client}>
      <DatabaseMigrations onReady={props.onReady} client={client}>
        {props.children}
      </DatabaseMigrations>
    </Context.Provider>
  );
}
