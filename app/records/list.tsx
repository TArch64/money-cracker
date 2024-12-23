import { type ReactNode, useMemo, useState } from 'react';
import { MainScreenLayout } from '@/layout';
import { MonthIndex, MonthRecords, MonthSlider } from '@/recordsList';

export default function List(): ReactNode {
  const [selectedIdx, setSelectedIdx] = useState<MonthIndex>(() => MonthIndex.current());
  const title = useMemo(() => selectedIdx.title, selectedIdx.reactDeps);

  return (
    <MainScreenLayout
      name="records/list"
      title={title}
    >
      <MonthSlider
        active={selectedIdx}
        onChange={setSelectedIdx}
      >
        {(idx) => <MonthRecords idx={idx} />}
      </MonthSlider>
    </MainScreenLayout>
  )
}
