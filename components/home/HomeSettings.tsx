import { useTranslation } from 'react-i18next';
import { HomeCard } from './HomeCard';
import { HomeCardTitle } from './HomeCardTitle';

export function HomeSettings() {
  const { t } = useTranslation();

  return (
    <HomeCard href="/settings">
      <HomeCardTitle
        linked
        title={t('home.sections.settings.title')}
      />
    </HomeCard>
  );
}
