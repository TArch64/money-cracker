import { createContext, type PropsWithChildren, type ReactNode, useContext, useEffect, useState } from 'react';
import { openDatabaseAsync, SQLiteDatabase } from 'expo-sqlite';
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from './migrations/migrations';

type AppDatabase = ExpoSQLiteDatabase<typeof schema> & { $client: SQLiteDatabase };

const Context = createContext<AppDatabase>(null!);

export const useDatabase = () => useContext(Context);

interface IDatabaseMigrationsProps extends PropsWithChildren {
  onReady(): void;
  client: AppDatabase;
}

function DatabaseMigrations(props: IDatabaseMigrationsProps): ReactNode {
  const { success, error } = useMigrations(props.client, migrations);

  useEffect(() => {
    if (error) {
      throw error;
    }

    props.onReady();
  }, [success, error]);

  if (!success) {
    return null;
  }

  return props.children;
}

export interface IDatabaseProviderProps extends PropsWithChildren {
  onReady(): void;
}

export function DatabaseProvider(props: IDatabaseProviderProps): ReactNode {
  const [client, setClient] = useState<AppDatabase>();

  useEffect(() => {
    let database: SQLiteDatabase;

    openDatabaseAsync('app.db', { enableChangeListener: true }).then((database_) => {
      database = database_
      const client = drizzle(database, { schema });
      setClient(client);
    });

    return () => database.closeSync()
  }, []);

  if (!client) {
    return null;
  }

  return (
    <DatabaseMigrations onReady={props.onReady} client={client}>
      <Context.Provider value={client}>
        {props.children}
      </Context.Provider>
    </DatabaseMigrations>
  );
}
