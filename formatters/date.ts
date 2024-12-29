import { useMemo } from 'react';
import { useLocales } from 'expo-localization';

export function useDateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const [locale] = useLocales();
  return useMemo(() => new Intl.DateTimeFormat(locale.languageTag!, options), [locale.languageTag]);
}
