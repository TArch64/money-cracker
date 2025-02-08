import type { ReactNode } from 'react';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';

export function HomeRecentRecordsEmpty(): ReactNode {
  return (
    <HomeCard>
      <HomeCardTitle
        title="Recent Transactions"
      />
    </HomeCard>
  );
}
