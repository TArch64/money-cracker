import { useQuery } from '@tanstack/react-query';
import { getLocaleCode } from '@/enums';
import { LOCALE_QUERY } from './locale';
import { useLocaleResolvedQuery } from './resolved';

export function useLocaleCodeQuery() {
  const localeQuery = useLocaleResolvedQuery();

  return useQuery({
    queryKey: [...LOCALE_QUERY, localeQuery.data, 'code'] as const,
    enabled: !!localeQuery.data,

    queryFn(args) {
      const [, , appLocale] = args.queryKey;
      return getLocaleCode(appLocale!);
    },
  });
}
