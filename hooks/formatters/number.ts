import { useLocales } from 'expo-localization';
import { useMemo } from 'react';

export function useNumberFormatter(options: Intl.NumberFormatOptions = {}) {
  const [locale] = useLocales();
  return useMemo(() => new Intl.NumberFormat(locale.languageTag!, options), [locale.languageTag]);
}
