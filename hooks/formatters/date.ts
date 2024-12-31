import { useMemo } from 'react';

export function useDateFormatter(options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  return useMemo(() => new Intl.DateTimeFormat('default', options), []);
}
