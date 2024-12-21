import type { ReactNode } from 'react';

export interface IPropsWithChildrenFn<A extends any[] = []> {
  children: (...args: A) => ReactNode;
}
