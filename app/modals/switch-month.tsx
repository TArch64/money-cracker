import type { ReactNode } from 'react';
import { SwitcherYearList } from '@/components/monthSwitcher';
import { ModalScreenLayout } from '@/components/layout';

export default function SwitchMonth(): ReactNode {
  return (
    <ModalScreenLayout title="Select Month">
      <SwitcherYearList />
    </ModalScreenLayout>
  );
}
