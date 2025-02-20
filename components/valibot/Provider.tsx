import { type PropsWithChildren, type ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocaleResolvedQuery } from '@/locale';
import { updateValibotLocale } from './locale';

export function ValibotProvider(props: PropsWithChildren): ReactNode {
  const localeQuery = useLocaleResolvedQuery();
  const { t } = useTranslation();

  useEffect(() => {
    if (localeQuery.data) updateValibotLocale(t);
  }, [localeQuery.data]);

  return props.children;
}
