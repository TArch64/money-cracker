import type { ReactNode } from 'react';
import { useMonthStore } from '@/stores';
import { useRecordsMonthSuspenseQuery } from '@/hooks/queries';
import { HomeRecentRecordsList } from './HomeRecentRecordsList';
import { HomeRecentRecordsEmpty } from './HomeRecentRecordsEmpty';

export function HomeRecentRecords(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);

  const recordsQuery = useRecordsMonthSuspenseQuery({
    year: activeMonthIdx.year,
    month: activeMonthIdx.month,
    subkey: ['recent-records'],
    limit: 4,
  });

  return recordsQuery.data.length ? (
    <HomeRecentRecordsList
      records={recordsQuery.data}
    />
  ) : (
    <HomeRecentRecordsEmpty />
  );
}
