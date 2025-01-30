import type { ReactNode } from 'react';
import { StyleSheet, type TextStyle, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { Link } from 'expo-router';
import { textRenderer } from '@/components/uiKitten';

export const BudgetEmpty = (): ReactNode => (
  <View style={styles.empty}>
    <Text category="s1" style={styles.emptyHeading}>
      No budget for this month
    </Text>

    <Link href="/budgets/new" asChild>
      <Button appearance="ghost">
        {textRenderer('Add Budget')}
      </Button>
    </Link>
  </View>
);

const styles = StyleSheet.create({
  empty: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyHeading: {
    marginBottom: 8,
  } satisfies TextStyle,
});
