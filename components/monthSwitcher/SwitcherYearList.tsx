import type { ReactNode } from 'react';
import { useMonthsSuspenseQuery } from '@/hooks/queries';
import { groupBy } from 'lodash-es';
import { MonthIdx } from '@/stores';
import { FlashList } from '@shopify/flash-list';
import { SwitcherYearHeader } from './SwitcherYearHeader';
import { SwitcherYearMonth } from './SwitcherYearMonth';

const enum ListItemType {
  YEAR_HEADER = 'year-header',
  MONTH = 'month',
}

interface IYearHeaderListItem {
  type: ListItemType.YEAR_HEADER;
  year: string;
}

interface IMonthListItem {
  type: ListItemType.MONTH;
  month: MonthIdx;
}

type ListItem = IYearHeaderListItem | IMonthListItem;

export function SwitcherYearList(): ReactNode {
  const monthsQuery = useMonthsSuspenseQuery((input) => {
    const currentMonth = MonthIdx.current();
    const months = input.length ? [currentMonth.next, ...input] : [currentMonth.next, currentMonth];

    return Object.entries(groupBy(months, 'year'))
      .sort(([a], [b]) => Number(b) - Number(a))
      .flatMap(([year, months]): ListItem[] => [
        { type: ListItemType.YEAR_HEADER, year },
        ...months.map((month) => ({ type: ListItemType.MONTH as const, month })),
      ]);
  });

  return (
    <FlashList
      removeClippedSubviews
      data={monthsQuery.data}
      getItemType={(item) => item.type}
      estimatedItemSize={39.7}

      renderItem={({ item }) => (
        item.type === ListItemType.YEAR_HEADER
          ? <SwitcherYearHeader year={item.year} />
          : <SwitcherYearMonth monthIdx={item.month} />
      )}
    />
  )
}
