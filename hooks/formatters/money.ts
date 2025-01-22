import { useLocales } from 'expo-localization';
import { useNumberFormatter } from './number';

export type MoneyFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>;

export function useMoneyFormatter(options: MoneyFormatOptions = {}): Intl.NumberFormat {
  const [locale] = useLocales();

  return useNumberFormatter({
    style: 'currency',
    currency: locale.currencyCode!,
    minimumFractionDigits: 0,
    ...options,
  });
}
