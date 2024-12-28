import type { ReactNode } from 'react';

export interface IPropsWithChildrenFn<A extends any[] = [], C = ReactNode> {
  children: (...args: A) => C;
}
