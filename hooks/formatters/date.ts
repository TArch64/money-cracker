import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { differenceInCalendarDays } from 'date-fns';
import { useLocaleCodeQuery } from '@/locale';

export function useDateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const localeQuery = useLocaleCodeQuery();
  return useMemo(() => new Intl.DateTimeFormat(localeQuery.data, options), [localeQuery.data]);
}

export function useDistanceDayFormatter(date: Date): string {
  const { t } = useTranslation();
  const formatter = useDateFormatter({ month: 'long', day: 'numeric' });

  return useMemo(() => {
    const now = new Date();
    const diff = differenceInCalendarDays(now, date);

    if (diff === 0) {
      return t('date.today');
    }

    if (diff === 1) {
      return t('date.yesterday');
    }

    return formatter.format(date);
  }, [date.getTime()]);
}
