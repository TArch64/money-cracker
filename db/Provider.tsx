import { createContext, type ReactNode, useContext, useEffect, useMemo } from 'react';
import { openDatabaseSync, SQLiteDatabase } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';
import type { IPropsWithChildrenFn } from '@/types';

type AppDatabase = ExpoSQLiteDatabase<typeof schema> & { $client: SQLiteDatabase };

const Context = createContext<AppDatabase>(null!);

export const useDatabase = () => useContext(Context);

interface IDatabaseMigrationsProps extends IPropsWithChildrenFn {
  client: AppDatabase;
  onReady: () => void;
}

function DatabaseMigrations(props: IDatabaseMigrationsProps): ReactNode {
  const { success, error } = useMigrations(props.client, migrations);

  useEffect(() => {
    if (error) {
      throw error;
    }

    if (success) {
      props.onReady();
    }
  }, [success, error]);

  if (!success && !error) {
    return null;
  }

  return props.children();
}

export interface IDatabaseProviderProps extends IPropsWithChildrenFn {
  onReady: () => void;
}

export function DatabaseProvider(props: IDatabaseProviderProps): ReactNode {
  const database = useMemo(() => openDatabaseSync('app.db', { enableChangeListener: true }), []);
  const client = useMemo(() => drizzle(database, { schema, logger: __DEV__ }), []);

  useEffect(() => () => database.closeSync(), []);

  return (
    <Context.Provider value={client}>
      <DatabaseMigrations onReady={props.onReady} client={client}>
        {props.children}
      </DatabaseMigrations>
    </Context.Provider>
  );
}
