export type MaybeFn<V> = V | (() => V);

function isFn<V>(value: MaybeFn<V>): value is (() => V) {
  return typeof value === 'function';
}

export function maybeFn<V>(value: MaybeFn<V>): V {
  return isFn(value) ? value() : value;
}
