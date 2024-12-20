import type { ReactNode } from 'react';
import { Button, Text } from '@ui-kitten/components';
import { FullScreenLayout } from '@/layout';
import { StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';
import { categories, RecordType, useDatabase } from '@/db';
import { useCategoriesScaffoldMutation } from '@/queries';
import { router } from 'expo-router';

export default function Intro(): ReactNode {
  const db = useDatabase();
  const scaffoldCategoriesMutation = useCategoriesScaffoldMutation();

  async function isCategoriesExists(): Promise<boolean> {
    return !!(await db.select().from(categories).limit(1)).length;
  }

  async function openScreen(type: RecordType): Promise<void> {
    if (!await isCategoriesExists()) {
      await scaffoldCategoriesMutation.mutateAsync();
    }

    router.replace(`/records/new?type=${type}`);
  }

  return (
    <FullScreenLayout>
      <View style={styles.column}>
        <Text category="h1" style={styles.heading}>
          Add your first
        </Text>

        <View style={styles.row}>
          <Button appearance="ghost" size="small" onPress={() => openScreen(RecordType.INCOME)}>
            {(props) => (
              <Text {...props} style={[props?.style, styles.rowText]}>
                Income
              </Text>
            )}
          </Button>

          <Text category="p1" style={styles.rowText}>
            or
          </Text>

          <Button appearance="ghost" size="small" onPress={() => openScreen(RecordType.EXPENSE)}>
            {(props) => (
              <Text {...props} style={[props?.style, styles.rowText]}>
                Expense
              </Text>
            )}
          </Button>
        </View>
      </View>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  } satisfies ViewStyle,

  heading: {
    fontSize: 24,
    marginBottom: 16,
  } satisfies TextStyle,

  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,

  rowText: {
    fontSize: 16,
  } satisfies TextStyle,
});
