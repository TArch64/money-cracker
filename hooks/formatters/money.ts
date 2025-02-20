import { useMemo } from 'react';
import { useLocaleResolvedQuery } from '@/locale';
import { AppLocale } from '@/enums';
import { getEnumValue } from '@/helpers/getEnumValue';
import { type INumberFormatter, useNumberFormatter } from './number';

export type MoneyFormatOptions = Omit<Intl.NumberFormatOptions, 'style' | 'currency'>;

export function useMoneyFormatter(options: MoneyFormatOptions = {}): INumberFormatter {
  const localeQuery = useLocaleResolvedQuery();

  const currency = useMemo(() => getEnumValue(localeQuery.data!, {
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
