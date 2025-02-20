import { maybeFn, type MaybeFn } from './maybeFn';

export type EnumValueMap<E extends string, V> = Record<E, MaybeFn<V>>;

export function getEnumValue<E extends string, V>(type: E, map: EnumValueMap<E, V>): V {
  return maybeFn<V>(map[type]);
}
