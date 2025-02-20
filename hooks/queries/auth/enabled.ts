import { useSuspenseQuery } from '@tanstack/react-query';
import { useAppAuth } from '@/hooks/useAppAuth';
import { AUTH_ENABLED_QUERY } from '../keys';

export function useAuthEnabledSuspenseQuery() {
  const appAuth = useAppAuth();

  return useSuspenseQuery({
    queryKey: AUTH_ENABLED_QUERY,
    queryFn: () => appAuth.isEnabled(),
  });
}
