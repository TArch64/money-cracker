import { useLocales } from 'expo-localization';
import { useMemo } from 'react';

export interface INumberFormatter {
  format: (value: number) => string;
}

export function useNumberFormatter(options: Intl.NumberFormatOptions = {}) {
  const [locale] = useLocales();

  return useMemo((): INumberFormatter => {
    const formatter = new Intl.NumberFormat(locale.languageTag!, options);

    return {
      format: (value) => formatter.format(value).replace(/^(-)/, '$1 '),
    };
  }, [locale.languageTag]);
}
