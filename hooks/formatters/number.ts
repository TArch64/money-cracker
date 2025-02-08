import { useMemo } from 'react';
import { useLocaleCodeQuery } from '@/locale';

export interface INumberFormatter {
  format: (value: number) => string;
}

export function useNumberFormatter(options: Intl.NumberFormatOptions = {}) {
  const localeQuery = useLocaleCodeQuery();

  return useMemo((): INumberFormatter => {
    const formatter = new Intl.NumberFormat(localeQuery.data, options);

    return {
      format: (value) => formatter.format(value).replace(/^(-)/, '$1 '),
    };
  }, [localeQuery.data]);
}
