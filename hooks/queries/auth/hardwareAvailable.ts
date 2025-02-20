import { useSuspenseQuery } from '@tanstack/react-query';
import { useAppAuth } from '@/hooks/useAppAuth';
import { AUTH_HARDWARE_AVAILABLE_QUERY } from '../keys';

export function useAuthHardwareAvailableSuspenseQuery() {
  const appAuth = useAppAuth();

  return useSuspenseQuery({
    queryKey: AUTH_HARDWARE_AVAILABLE_QUERY,
    queryFn: () => appAuth.isHardwareAvailable(),
  });
}
