import type { ReactNode } from 'react';
import { FullScreenLayout } from '@/components/layout';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { textRenderer } from '@/components/uiKitten';
import { showConfirm } from '@/helpers/showConfirm';
import { useMutation } from '@tanstack/react-query';
import { budgetCategories, budgets, categories, records, useDatabase, USER_ID, users } from '@/db';
import { useRouter } from 'expo-router';

const configs = [
  { message: 'Are you sure?', accept: 'Yes, Delete' },
  { message: 'Are you really sure?', accept: 'Yes, I\'m Sure' },
] as const;

export default function ClearData(): ReactNode {
  const db = useDatabase();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn() {
      return db.transaction(async () => {
        await db.delete(records);
        await db.delete(budgetCategories);
        await db.delete(budgets);
        await db.delete(categories);
        await db.delete(users);
        await db.insert(users).values({ id: USER_ID });
      });
    },

    onSuccess() {
      router.dismissAll();
      router.push('/');
    },
  });

  const isConfirmed = (index: 0 | 1) => showConfirm({
    title: 'Clear Data',
    message: configs[index].message,

    accept: {
      text: configs[index].accept,
      style: 'destructive',
    },

    decline: {
      text: 'Cancel',
      style: 'cancel',
      isPreferred: true,
    },
  });

  return (
    <FullScreenLayout
      title="Clear Data"
      canGoBack={!mutation.isPending}
    >
      <View style={styles.root}>
        <Text>
          Are you sure you want to delete all your data? This action cannot be undone.
        </Text>

        <Button
          status="danger"
          style={styles.button}

          onPress={async () => {
            if (!await isConfirmed(0)) return;
            if (!await isConfirmed(1)) return;
            mutation.mutate();
          }}
        >
          {textRenderer('Clear Data')}
        </Button>
      </View>
    </FullScreenLayout>
  );
}

const styles = StyleSheet.create({
  root: {
    height: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 104,
  } satisfies ViewStyle,

  button: {
    marginTop: 'auto',
  } satisfies ViewStyle,
});
