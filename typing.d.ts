type UpTo<N extends number, T extends any[] = [], I extends number = 1> =
  I extends N
    ? I
    : I | UpTo<N, [...T, 1], [...T, 1]['length']>;

declare module '@ui-kitten/components' {
  import type { ElementStatus } from '@/components/uiKitten';

  type Colors = ElementStatus | `${ElementStatus}-transparent`;
  type ColorKey = `color-${Colors}-${UpTo<11>}00`;
  type TextKey = 'text-basic-color' | 'text-hint-color';
  type BgKey = `background-basic-color-${UpTo<3>}` | `color-basic-control-transparent-${UpTo<6>}00`;
  type BorderKey = `border-basic-color-${UpTo<4>}`;
  type BoxShadowKey = `box-shadow-${UpTo<2>}`;
  type ColorDefaultKey = 'color-control-default';
  export type Theme = Record<ColorKey | BgKey | ColorDefaultKey | BoxShadowKey | TextKey | BorderKey, string>;

  export function useTheme(): Theme;
}

declare global {
  interface NodeModule {
    hot?: {
      accept(callback?: () => void): void;
    };
  }
}

export {};
