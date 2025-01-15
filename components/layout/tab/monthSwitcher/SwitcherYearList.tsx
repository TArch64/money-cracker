import type { ReactNode } from 'react';
import { Divider, List, useTheme } from '@ui-kitten/components';
import { useMonthsSuspenseQuery } from '@/hooks/queries';
import { groupBy } from 'lodash-es';
import type { StyleProp, ViewStyle } from 'react-native';
import { SwitcherMonthList } from './SwitcherMonthList';

export function SwitcherYearList(): ReactNode {
  const theme = useTheme();

  const monthsQuery = useMonthsSuspenseQuery((months) => {
    return Object.entries(groupBy(months, 'year'))
      .sort(([a], [b]) => Number(b) - Number(a));
  });

  return (
    <List
      data={monthsQuery.data}

      style={{
        backgroundColor: theme['background-basic-color-1'],
      } satisfies StyleProp<ViewStyle>}

      ItemSeparatorComponent={Divider}
      renderItem={({ item: [year, months] }) => <SwitcherMonthList year={year} months={months} />}
    />
  );
}
