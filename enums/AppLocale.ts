import { getEnumValue } from '@/helpers/getEnumValue';

export enum AppLocale {
  SYSTEM = 'system',
  UA = 'ua',
  EN = 'en',
}

export type ResolvedLocale = Exclude<AppLocale, AppLocale.SYSTEM>;

export function getLocaleCode(locale: ResolvedLocale): string {
  return getEnumValue(locale, {
    [AppLocale.EN]: 'en-US',
    [AppLocale.UA]: 'uk-UA',
  });
}
