import { type DependencyList, useMemo } from 'react';
import { debounce } from 'lodash-es';

export function useDebounced<F extends (...args: any[]) => void>(fn: F, time: number, deps: DependencyList) {
  return useMemo(() => debounce(fn, time), deps);
}
