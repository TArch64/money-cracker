import type { ReactNode } from 'react';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';

export function HomeGoals(): ReactNode {
  return (
    <HomeCard>
      <HomeCardTitle title="Spending Goals" />
    </HomeCard>
  );
}
