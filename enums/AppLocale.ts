export enum AppLocale {
  SYSTEM = 'system',
  UA = 'ua',
  EN = 'en',
}

export type ResolvedLocale = Exclude<AppLocale, AppLocale.SYSTEM>;
