import { HomeCard } from './HomeCard';
import { HomeCardTitle } from './HomeCardTitle';
import { useTranslation } from 'react-i18next';

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
