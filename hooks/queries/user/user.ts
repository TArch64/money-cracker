import { useSuspenseQuery } from '@tanstack/react-query';
import { eq } from 'drizzle-orm';
import { useDatabase, USER_ID, users } from '@/db';
import { USER_QUERY } from '../keys';

export function useUserSuspenseQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: USER_QUERY,

    async queryFn() {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, USER_ID));

      return user;
    },
  });
}
