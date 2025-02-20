import type { ReactNode } from 'react';
import { type Href, Redirect } from 'expo-router';
import { useUserSuspenseQuery } from '@/hooks/queries';
import { IntroState } from '@/enums';
import { getEnumValue } from '@/helpers/getEnumValue';

export default function Index(): ReactNode {
  const userQuery = useUserSuspenseQuery();

  const href = getEnumValue<IntroState, Href>(userQuery.data.intro, {
    [IntroState.PENDING]: '/intro',
    [IntroState.ENABLE_AUTH]: '/intro/enable-auth',
    [IntroState.COMPLETED]: '/home',
  });

  return <Redirect href={href} />;
}
