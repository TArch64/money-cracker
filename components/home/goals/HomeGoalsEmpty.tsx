import type { ReactNode } from 'react';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';
import { Text } from '@ui-kitten/components';
import { useMonthStore } from '@/stores';
import { StyleSheet, type ViewStyle } from 'react-native';

export function HomeGoalsEmpty(): ReactNode {
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);

  return (
    <HomeCard>
      <HomeCardTitle
        title="Spending Goals"
        style={styles.title}
      />

      <Text>
        There are no goals for this month yet
      </Text>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  } satisfies ViewStyle,
});
