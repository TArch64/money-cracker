import { useQuery } from '@tanstack/react-query';
import { useDatabase, users } from '@/db';
import { AppLocale } from '@/enums';

export const LOCALE_QUERY = ['app', 'locale'] as const;

export function useLocaleQuery() {
  const db = useDatabase();

  return useQuery({
    queryKey: LOCALE_QUERY,
    initialData: null,

    async queryFn(): Promise<AppLocale> {
      const rows = await db
        .select({ locale: users.locale })
        .from(users)
        .limit(1);

      return rows[0].locale;
    },
  });
}
