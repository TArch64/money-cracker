import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { SwitcherYearList } from '@/components/monthSwitcher';
import { ModalScreenLayout } from '@/components/layout';

export default function Switcher(): ReactNode {
  const { t } = useTranslation();

  return (
    <ModalScreenLayout title={t('monthSwitcher.title')}>
      <SwitcherYearList />
    </ModalScreenLayout>
  );
}
