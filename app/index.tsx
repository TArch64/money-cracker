import { type ReactNode } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { usePrefetchRecordsBoundariesSuspenseQuery, useRecordsExistsSuspenseQuery } from '@/hooks/queries';

export default function Index(): ReactNode {
  const router = useRouter();
  const recordsExistsQuery = useRecordsExistsSuspenseQuery();
  const prefetchRecordsBoundariesQuery = usePrefetchRecordsBoundariesSuspenseQuery();

  function openIntro(): void {
    router.replace('/intro');
  }

  async function openList(): Promise<void> {
    await prefetchRecordsBoundariesQuery();
    router.replace('/records');
  }

  useFocusEffect(() => {
    (async () => {
      recordsExistsQuery.data ? await openList() : openIntro();
      await SplashScreen.hideAsync();
    })();
  });

  return null;
}
