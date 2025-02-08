import { type ReactNode, useMemo } from 'react';
import { HomeCard } from '../HomeCard';
import { HomeCardTitle } from '../HomeCardTitle';
import { MonthIdx } from '@/stores';
import { type IMonthBudget } from '@/hooks/queries';
import { HomeCategoryGoal } from './HomeCategoryGoal';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

export interface IHomeGoalsListProps {
  budget: IMonthBudget;
  monthIdx: MonthIdx;
}

export function HomeGoalsList(props: IHomeGoalsListProps): ReactNode {
  const { t } = useTranslation();

  const dayProgress = useMemo(() => {
    const now = new Date();
    const currentMonthIdx = MonthIdx.fromDate(now);

    if (props.monthIdx.isBefore(currentMonthIdx)) {
      return 1;
    }

    if (props.monthIdx.isAfter(currentMonthIdx)) {
      return 0;
    }

    return now.getDate() / new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  }, [props.monthIdx.id]);

  return (
    <HomeCard
      href={() => ({
        pathname: '/budgets/[budgetId]/edit',
        params: { budgetId: props.budget.id },
      })}
    >
      <HomeCardTitle
        linked
        title={t('home.sections.goals.title')}
        style={styles.title}
      />

      <View style={styles.list}>
        {props.budget.categories.map((category) => (
          <HomeCategoryGoal
            key={category.categoryId}
            category={category}
            dayProgress={dayProgress}
          />
        ))}
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 12,
  } satisfies ViewStyle,

  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  } satisfies ViewStyle,
});
