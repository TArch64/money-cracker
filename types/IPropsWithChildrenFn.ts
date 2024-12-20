import type { ReactNode } from 'react';

export interface IPropsWithChildrenFn {
  children(): ReactNode;
}
