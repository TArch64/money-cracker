import { HomeCard } from './HomeCard';
import { HomeCardTitle } from './HomeCardTitle';

export function HomeSettings() {
  return (
    <HomeCard href="/settings">
      <HomeCardTitle linked title="Settings" />
    </HomeCard>
  );
}
