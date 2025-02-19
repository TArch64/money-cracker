import { useLocales } from 'expo-localization';
import { useQuery } from '@tanstack/react-query';
import { AppLocale, type ResolvedLocale } from '@/enums';
import { LOCALE_QUERY, useLocaleQuery } from './locale';

export function useLocaleResolvedQuery() {
  const [locale] = useLocales();
  const localeQuery = useLocaleQuery();

  return useQuery({
    queryKey: [...LOCALE_QUERY, localeQuery.data, 'resolved'] as const,
    initialData: null,
    enabled: !!localeQuery.data,

    async queryFn(args): Promise<ResolvedLocale> {
      const [, , appLocale] = args.queryKey;

      if (appLocale !== AppLocale.SYSTEM) {
        return appLocale!;
      }

      return locale.languageCode === 'uk' ? AppLocale.UA : AppLocale.EN;
    },
  });
}
