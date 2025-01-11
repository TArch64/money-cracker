declare module '@ui-kitten/components' {
  type BaseColors = 'basic' | 'primary' | 'success' | 'warning' | 'danger'
  type ColorLevels = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  type Colors = BaseColors | `${BaseColors}-transparent`
  type ColorKey = `color-${Colors}-${ColorLevels}`
  type BgKeys = `background-basic-color-${1 | 2 | 3}`
  type Theme = Record<ColorKey | BgKeys, string>;

  export function useTheme(): Theme;
}

export {};
