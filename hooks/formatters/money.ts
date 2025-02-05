import { useLocales } from 'expo-localization';
import { type INumberFormatter, useNumberFormatter } from './number';

export type MoneyFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>;

export function useMoneyFormatter(options: MoneyFormatOptions = {}): INumberFormatter {
  const [locale] = useLocales();

  return useNumberFormatter({
    style: 'currency',
    currency: locale.currencyCode!,
    minimumFractionDigits: 0,
    ...options,
  });
}
