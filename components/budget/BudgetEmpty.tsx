import type { ReactNode } from 'react';
import { StyleSheet, type TextStyle, View } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { Link } from 'expo-router';

export const BudgetEmpty = (): ReactNode => (
  <View style={styles.empty}>
    <Text category="s1" style={styles.emptyHeading}>
      No budget for this month
    </Text>

    <Link href="/budgets/new" asChild>
      <Button appearance="ghost">
        {(txtProps) => <Text {...txtProps}>Add Budget</Text>}
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
