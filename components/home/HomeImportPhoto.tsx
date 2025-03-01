import type { ReactNode } from 'react';
import { Text } from '@ui-kitten/components';
import { StyleSheet, type ViewStyle } from 'react-native';
import { HomeCard } from '@/components/home/HomeCard';
import { HomeCardTitle } from '@/components/home/HomeCardTitle';

export function HomeImportPhoto(): ReactNode {
  return (
    <HomeCard>
      <HomeCardTitle
        linked
        title="Import from Photo"
        style={styles.title}
      />

      <Text>
        Use your camera to import your receipts and bills
      </Text>
    </HomeCard>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  } satisfies ViewStyle,
});
