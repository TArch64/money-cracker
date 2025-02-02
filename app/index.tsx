import type { ReactNode } from 'react';
import { type Href, Redirect } from 'expo-router';
import { useUserSuspenseQuery } from '@/hooks/queries';
import { IntroState } from '@/enums';

export default function Index(): ReactNode {
  const userQuery = useUserSuspenseQuery();

  const href: Href = userQuery.data.intro === IntroState.PENDING ? '/intro' : '/home';
  return <Redirect href={href} />;
}
