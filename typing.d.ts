declare module '@ui-kitten/components' {
  import type { ElementStatus } from '@/components/uiKitten';

  type ColorLevels = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100
  type Colors = ElementStatus | `${ElementStatus}-transparent`
  type ColorKey = `color-${Colors}-${ColorLevels}`
  type BgKeys = `background-basic-color-${1 | 2 | 3}`
  type BoxShadowKeys = `box-shadow-${1 | 2}`
  export type Theme = Record<ColorKey | BgKeys | BoxShadowKeys, string>;

  export function useTheme(): Theme;
}

export {};
