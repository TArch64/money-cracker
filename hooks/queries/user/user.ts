import { useSuspenseQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { type AppDatabase, useDatabase, type User, USER_ID, users } from '@/db';
import { USER_QUERY } from '../keys';

async function getUser(db: AppDatabase): Promise<User> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, USER_ID));

  return user;
}

export function useUserQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: USER_QUERY,
    queryFn: () => getUser(db),
  });
}

export function useUserSuspenseQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: USER_QUERY,
    queryFn: () => getUser(db),
  });
}
