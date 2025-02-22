import { type DependencyList, useMemo } from 'react';
import { debounce, type DebouncedFunc } from 'lodash-es';

export function useDebounce<C extends (...args: any) => any>(callback: C, time: number, deps: DependencyList): DebouncedFunc<C> {
  return useMemo(() => {
    return debounce(callback, time);
    // eslint-disable-next-line react-compiler/react-compiler
  }, deps);
}
