import { type ReactNode } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCategoriesScaffoldMutation, usePrefetchRecordsBoundariesQuery, useRecordsExistsQuery } from '@/queries';
import { waitStackAnimation } from '@/layout';

export default function Index(): ReactNode {
  const router = useRouter();
  const recordsExistsQuery = useRecordsExistsQuery()
  const scaffoldCategoriesMutation = useCategoriesScaffoldMutation();
  const prefetchRecordsBoundariesQuery = usePrefetchRecordsBoundariesQuery();

  function openIntro(): void {
    router.replace('/records/intro');
  }

  async function openList(): Promise<void> {
    await prefetchRecordsBoundariesQuery();
    router.replace('/records/list');
  }

  useFocusEffect(() => {
    scaffoldCategoriesMutation.mutateAsync().then(async () => {
      recordsExistsQuery.data ? await openList() : openIntro();
      await waitStackAnimation();
      await SplashScreen.hideAsync();
    });
  });

  return null;
}
