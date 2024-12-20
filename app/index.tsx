import type { ReactNode } from 'react';
import { Redirect } from 'expo-router';
import { useRecordsExistsQuery } from '@/queries';

export default function Index(): ReactNode {
  const recordsExistsQuery = useRecordsExistsQuery()
  const path = recordsExistsQuery.data ? '/records/list' : '/records/intro';
  return <Redirect href={path} />;
}
