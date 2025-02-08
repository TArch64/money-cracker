import { useQuery } from '@tanstack/react-query';
import { useDatabase, users } from '@/db';
import { useLocales } from 'expo-localization';
import { AppLocale, getLocaleCode, type ResolvedLocale } from '@/enums';

export const LOCALE_QUERY = ['app', 'locale'];

export function useLocaleQuery() {
  const [locale] = useLocales();
  const db = useDatabase();

  return useQuery({
    queryKey: LOCALE_QUERY,
    initialData: null,

    async queryFn(): Promise<ResolvedLocale> {
      const rows = await db
        .select({ locale: users.locale })
        .from(users)
        .limit(1);

      if (rows[0].locale !== AppLocale.SYSTEM) {
        return rows[0].locale;
      }

      return locale.languageCode === 'uk' ? AppLocale.UA : AppLocale.EN;
    },
  });
}

export function useLocaleCodeQuery() {
  const localeQuery = useLocaleQuery();

  return useQuery({
    queryKey: [...LOCALE_QUERY, 'code'],
    queryFn: () => getLocaleCode(localeQuery.data!),
  });
}
