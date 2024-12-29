import { type ReactNode } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { usePrefetchRecordsBoundariesQuery, useRecordsExistsQuery } from '@/queries';

export default function Index(): ReactNode {
  const router = useRouter();
  const recordsExistsQuery = useRecordsExistsQuery()
  const prefetchRecordsBoundariesQuery = usePrefetchRecordsBoundariesQuery();

  function openIntro(): void {
    router.replace('/records/intro');
  }

  async function openList(): Promise<void> {
    await prefetchRecordsBoundariesQuery();
    router.replace('/records/list');
  }

  useFocusEffect(() => {
    (async () => {
      recordsExistsQuery.data ? await openList() : openIntro();
      await SplashScreen.hideAsync();
    })();
  });

  return null;
}
