import React, { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider(props: PropsWithChildren): ReactNode {
  const client = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        mutations: {
          onError: console.error,
        },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={client}>
      {props.children}
    </QueryClientProvider>
  )
}
