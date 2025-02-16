import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { randomUUID } from 'expo-crypto';
import type { IPropsWithChildrenFn } from '@/types';
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

const STORE_PRAGMA_KEY = 'db-pragma-key';

async function getPragmaKey(): Promise<string> {
  let key = await getItemAsync(STORE_PRAGMA_KEY, {
    requireAuthentication: false,
  });

  if (key) {
    return key;
  }

  key = randomUUID();

  await setItemAsync(STORE_PRAGMA_KEY, key, {
    requireAuthentication: false,
  });

  return key;
}

export function DatabaseProvider(props: IDatabaseProviderProps): ReactNode {
  const [client, setClient] = useState<AppDatabase | null>(null);

  useEffect(() => {
    let database: SQLiteDatabase;

    (async () => {
      try {
        database = await openDatabaseAsync('app.db');
        const key = await getPragmaKey();
        await database.execAsync(`PRAGMA key = '${key}';`);
        setClient(drizzle(database, { schema, logger: __DEV__ }));
      } catch (error) {
        console.error('Failed to open database', error);
      }
    })();

    return () => {
      try {
        database?.closeSync();
      } catch {
        // ignore
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
