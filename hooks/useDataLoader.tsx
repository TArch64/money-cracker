import { createContext, type PropsWithChildren, type ReactNode, useContext, useMemo } from 'react';
import DataLoader, { type BatchLoadFn } from 'dataloader';

type UseDataLoader = <K, V, C = K>(key: symbol, batchLoadFn: BatchLoadFn<K, V>) => DataLoader<K, V, C>;

const Context = createContext<UseDataLoader>(null!);

export function DataLoaderProvider(props: PropsWithChildren): ReactNode {
  const context = useMemo((): UseDataLoader => {
    const loaders = new Map<symbol, DataLoader<any, any>>();

    return (key, batchLoadFn) => {
      if (loaders.has(key)) {
        return loaders.get(key)!;
      }

      const loader = new DataLoader(batchLoadFn, { cache: false });
      loaders.set(key, loader);
      return loader;
    };
  }, []);

  return (
    <Context.Provider value={context}>
      {props.children}
    </Context.Provider>
  );
}

export const useDataLoader: UseDataLoader = (key, batchLoadFn) => {
  return useContext(Context)(key, batchLoadFn);
};
