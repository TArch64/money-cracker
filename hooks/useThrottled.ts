import { type DependencyList, useMemo } from 'react';
import { type DebouncedFunc, throttle, type ThrottleSettings } from 'lodash-es';

type Fn = (...args: any[]) => void;
type Options = ThrottleSettings & { time: number };

export function useThrottled<F extends Fn>(fn: F, time: number, deps: DependencyList): DebouncedFunc<F>;
export function useThrottled<F extends Fn>(fn: F, time: Options, deps: DependencyList): DebouncedFunc<F>;
export function useThrottled<F extends Fn>(fn: F, time: number | Options, deps: DependencyList): DebouncedFunc<F> {
  return useMemo(() => {
    const normalizedTime = typeof time === 'number' ? time : time.time;
    const settings = typeof time === 'number' ? {} : time;
    return throttle(fn, normalizedTime, settings);
  }, deps);
}
