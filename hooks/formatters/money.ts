import { useMemo } from 'react';
import { useLocaleQuery } from '@/locale';
import { AppLocale, getLocaleValue } from '@/enums';
import { type INumberFormatter, useNumberFormatter } from './number';

export type MoneyFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>;

export function useMoneyFormatter(options: MoneyFormatOptions = {}): INumberFormatter {
  const localeQuery = useLocaleQuery();

  const currency = useMemo(() => getLocaleValue(localeQuery.data!, {
    [AppLocale.UA]: 'UAH',
    [AppLocale.EN]: 'USD',
  }), [localeQuery.data]);

  return useNumberFormatter({
    currency,
    style: 'currency',
    minimumFractionDigits: 0,
    ...options,
  });
}
