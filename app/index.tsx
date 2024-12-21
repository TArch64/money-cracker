import { type ReactNode } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCategoriesScaffoldMutation, useRecordsExistsQuery } from '@/queries';
import { waitInitialStackEnter } from '@/layout';

export default function Index(): ReactNode {
  const router = useRouter();
  const recordsExistsQuery = useRecordsExistsQuery()
  const scaffoldCategoriesMutation = useCategoriesScaffoldMutation();

  useFocusEffect(() => {
    scaffoldCategoriesMutation.mutateAsync().then(() => {
      router.replace(recordsExistsQuery.data ? '/records/list' : '/records/intro');
      waitInitialStackEnter(SplashScreen.hideAsync);
    });
  });

  return null;
}
