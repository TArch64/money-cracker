declare module '@ui-kitten/components' {
  import type { ElementStatus } from '@/components/uiKitten';

  type ColorLevels = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  type Colors = ElementStatus | `${ElementStatus}-transparent`
  type ColorKey = `color-${Colors}-${ColorLevels}`
  type BgKeys = `background-basic-color-${1 | 2 | 3}`
  export type Theme = Record<ColorKey | BgKeys, string> & { 'box-shadow': string };

  export function useTheme(): Theme;
}

export {};
