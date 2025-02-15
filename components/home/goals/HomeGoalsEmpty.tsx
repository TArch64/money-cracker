import { type ReactNode, useCallback } from 'react';
import { Button, Text } from '@ui-kitten/components';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { useMonthStore } from '@/stores';
import { useBudgetCopyMutation, useBudgetPreviousMonthSuspenseQuery } from '@/hooks/queries';

export function HomeGoalsEmpty(): ReactNode {
  const { t } = useTranslation();
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const previousMonthGoals = useBudgetPreviousMonthSuspenseQuery(activeMonthIdx.year, activeMonthIdx.month);
  const copyMutation = useBudgetCopyMutation();

  const copyBudget = useCallback(() => {
    copyMutation.mutate({
      monthIdx: activeMonthIdx,
      sourceId: previousMonthGoals.data!.id,
    });
  }, []);

  return (
    <HomeCard>
      <HomeCardTitle
        title={t('home.sections.goals.title')}
        style={styles.title}
      />

      <Text>
        {t('home.sections.goals.empty.description')}
      </Text>

      <View style={styles.actionRow}>
        {previousMonthGoals.data ? (
          <>
            <Button
              appearance="link"
              size="inline"
              disabled={copyMutation.isPending}
              onPress={copyBudget}
            >
              {t('home.sections.goals.empty.copy.copy')}
            </Button>

            <Text>
              {t('home.sections.goals.empty.copy.decision')}
            </Text>

            <Link asChild href="/budgets/new">
              <Button appearance="link" size="inline">
                {t('home.sections.goals.empty.copy.new')}
              </Button>
            </Link>
          </>
        ) : (
          <Link asChild href="/budgets/new">
            <Button appearance="link" size="inline">
              {t('home.sections.goals.empty.new')}
            </Button>
          </Link>
        )}
      </View>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  } satisfies ViewStyle,

  actionRow: {
    marginTop: 4,
    gap: 4,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  } satisfies ViewStyle,
});
