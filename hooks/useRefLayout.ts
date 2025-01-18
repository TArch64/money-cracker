import { type RefCallback, useState } from 'react';
import type { LayoutRectangle, NativeMethods } from 'react-native';

type RefLayout = [ref: RefCallback<NativeMethods>, layout: LayoutRectangle | null];

export function useRefLayout(): RefLayout {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  const ref: RefCallback<NativeMethods> = (instance) => {
    instance
      ? instance.measure((x, y, width, height) => setLayout({ x, y, width, height }))
      : setLayout(null);
  };

  return [ref, layout];
}
