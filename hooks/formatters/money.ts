import { useMemo } from 'react';
import { useLocales } from 'expo-localization';

export type MoneyFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>;

export function useMoneyFormatter(options: MoneyFormatOptions = {}): Intl.NumberFormat {
  const [locale] = useLocales();

  return useMemo(() => {
    return new Intl.NumberFormat(locale.languageTag!, {
      ...options,
      style: 'currency',
      currency: locale.currencyCode!,
      minimumFractionDigits: 0,
    });
  }, [locale.currencyCode, locale.languageTag]);
}
