type UpTo<N extends number, T extends any[] = [], I extends number = 1> =
  I extends N
    ? I
    : I | UpTo<N, [...T, 1], [...T, 1]['length']>;

declare module '@ui-kitten/components' {
  import type { ElementStatus } from '@/components/uiKitten';

  type Colors = ElementStatus | `${ElementStatus}-transparent`;
  type ColorKey = `color-${Colors}-${UpTo<11>}00`;
  type TextKey = 'text-basic-color' | 'text-hint-color';
  type BgKey = `background-basic-color-${UpTo<3>}`;
  type BorderKey = `border-basic-color-${UpTo<4>}`;
  type BoxShadowKey = `box-shadow-${UpTo<2>}`;
  export type Theme = Record<ColorKey | BgKey | BoxShadowKey | TextKey | BorderKey, string>;

  export function useTheme(): Theme;
}

export {};
