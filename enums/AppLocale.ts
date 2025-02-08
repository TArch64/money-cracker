import { maybeFn, type MaybeFn } from '@/helpers/maybeFn';

export enum AppLocale {
  SYSTEM = 'system',
  UA = 'ua',
  EN = 'en',
}

export type ResolvedLocale = Exclude<AppLocale, AppLocale.SYSTEM>;

export function getLocaleValue<V>(type: ResolvedLocale, map: Record<ResolvedLocale, MaybeFn<V>>): V {
  return maybeFn(map[type]);
}

export function getLocaleCode(locale: ResolvedLocale): string {
  return getLocaleValue(locale, {
    [AppLocale.EN]: 'en-US',
    [AppLocale.UA]: 'uk-UA',
  });
}
