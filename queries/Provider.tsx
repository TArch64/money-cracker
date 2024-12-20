import React, { type PropsWithChildren, type ReactNode, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export function QueryProvider(props: PropsWithChildren): ReactNode {
  const client = useMemo(() => new QueryClient(), []);

  return (
    <QueryClientProvider client={client}>
      {props.children}
    </QueryClientProvider>
  )
}
