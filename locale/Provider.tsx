import i18next, { type i18n } from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { IPropsWithChildrenFn } from '@/types';
import { en, type Lang, ua } from './lang';
import { useLocaleQuery } from './query';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: {
      translation: Lang;
    };
  }
}

export interface I18NProviderProps extends IPropsWithChildrenFn {
}

export function I18NProvider(props: I18NProviderProps) {
  const localeQuery = useLocaleQuery();
  const [instance, setInstance] = useState<i18n | null>(null);

  useEffect(() => {
    if (!localeQuery.data) {
      return;
    }

    if (instance) {
      instance.changeLanguage(localeQuery.data);
      return;
    }

    i18next
      .use(initReactI18next)
      .init({
        lng: localeQuery.data,

        resources: {
          en: { translation: en },
          ua: { translation: ua },
        },

        interpolation: {
          escapeValue: false,
        },
      })
      .then(() => setInstance(i18next));
  }, [localeQuery.data]);

  if (!instance) {
    return null;
  }

  return (
    <I18nextProvider i18n={instance}>
      {props.children()}
    </I18nextProvider>
  );
}
