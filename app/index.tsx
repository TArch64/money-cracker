import type { ReactNode } from 'react';
import { type Href, Redirect } from 'expo-router';
import { useAuthEnabledSuspenseQuery, useUserSuspenseQuery } from '@/hooks/queries';
import { IntroState } from '@/enums';
import { getEnumValue } from '@/helpers/getEnumValue';

export default function Index(): ReactNode {
  const userQuery = useUserSuspenseQuery();
  const authEnabledQuery = useAuthEnabledSuspenseQuery();

  if (IntroState.COMPLETED && authEnabledQuery.data) {
    return <Redirect href="/auth" />;
  }

  const href = getEnumValue<IntroState, Href>(userQuery.data.intro, {
    [IntroState.PENDING]: '/intro',
    [IntroState.ENABLE_AUTH]: '/intro/enable-auth',
    [IntroState.COMPLETED]: '/home',
  });

  return <Redirect href={href} />;
}
