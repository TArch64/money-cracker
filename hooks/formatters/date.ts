import { useMemo } from 'react';
import { useLocaleCodeQuery } from '@/locale';

export function useDateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const localeQuery = useLocaleCodeQuery();
  return useMemo(() => new Intl.DateTimeFormat(localeQuery.data, options), [localeQuery.data]);
}
