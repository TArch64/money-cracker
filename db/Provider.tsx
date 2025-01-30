import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';
import type { IPropsWithChildrenFn } from '@/types';

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

export function DatabaseProvider(props: IDatabaseProviderProps): ReactNode {
  const database = useMemo(() => openDatabaseSync('app.db'), []);
  const client = useMemo(() => drizzle(database, { schema, logger: __DEV__ }), []);

  useEffect(() => () => {
    try {
      database.closeSync();
    } catch {
    }
  }, []);

  return (
    <Context.Provider value={client}>
      <DatabaseMigrations onReady={props.onReady} client={client}>
        {props.children}
      </DatabaseMigrations>
    </Context.Provider>
  );
}
