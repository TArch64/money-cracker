import type { ReactNode } from 'react';
import { type Href, Redirect } from 'expo-router';
import { useRecordsExistsSuspenseQuery } from '@/hooks/queries';

export default function Index(): ReactNode {
  const recordsExistsQuery = useRecordsExistsSuspenseQuery();

  const href: Href = recordsExistsQuery.data ? '/records' : '/intro';
  return <Redirect href={href} />;
}
