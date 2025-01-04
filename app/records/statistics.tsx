import { type ReactNode, useMemo } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';
import { useDateFormatter } from '@/hooks/formatters';
import { MonthIdx } from '@/components/recordsList';
import { useLocalSearchParams } from 'expo-router';

type SearchParams = {
  year: string;
  month: string;
};

export default function Statistics(): ReactNode {
  const { year, month } = useLocalSearchParams<SearchParams>();
  const monthIdx = useMemo(() => new MonthIdx(+year, +month), [year, month]);

  const dateFormatter = useDateFormatter({ year: 'numeric', month: 'long' });
  const dateTitle = dateFormatter.format(monthIdx.date);

  return (
    <FullScreenLayout title={`${dateTitle} Statistics`}>
      <Text>statistics</Text>
    </FullScreenLayout>
  );
}
