import type { ReactNode } from 'react';
import { groupBy } from 'lodash-es';
import { FlatList } from 'react-native';
import { useMonthsSuspenseQuery } from '@/hooks/queries';
import { MonthIdx } from '@/stores';
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

function formatSections(months: MonthIdx[]): ListItem[] {
  return Object.entries(groupBy(months, 'year'))
    .sort(([a], [b]) => Number(b) - Number(a))
    .flatMap(([year, months]): ListItem[] => [
      { type: ListItemType.YEAR_HEADER, year },
      ...months.map((month) => ({ type: ListItemType.MONTH as const, month })),
    ]);
}

export function SwitcherYearList(): ReactNode {
  const monthsQuery = useMonthsSuspenseQuery((input) => {
    const currentMonth = MonthIdx.current();
    const nextMonth = currentMonth.next;

    if (!input.length) {
      return formatSections([currentMonth.next, currentMonth]);
    }

    const months = [...input];
    if (months[0].id !== nextMonth.id) months.unshift(nextMonth);
    if (months[1].id !== currentMonth.id) months.unshift(currentMonth);
    return formatSections(months);
  });

  return (
    <FlatList
      removeClippedSubviews
      data={monthsQuery.data}

      renderItem={({ item }) => (
        item.type === ListItemType.YEAR_HEADER
          ? <SwitcherYearHeader year={item.year} />
          : <SwitcherYearMonth monthIdx={item.month} />
      )}
    />
  );
}
