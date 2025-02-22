import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { Button, Text } from '@ui-kitten/components';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { textRenderer } from '@/components/uiKitten';
import { showConfirm } from '@/helpers/showConfirm';
import { budgetCategories, budgets, categories, records, useDatabase, USER_ID, users } from '@/db';
import { FullScreenLayout } from '@/components/layout';

export default function ClearData(): ReactNode {
  const db = useDatabase();
  const router = useRouter();
  const { t } = useTranslation();

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
      router.replace('/intro');
    },
  });

  const isConfirmed = (index: 1 | 2) => showConfirm({
    title: t('settings.clearData.confirm.title'),
    message: t(`settings.clearData.confirm${index}.message`),

    accept: {
      text: t(`settings.clearData.confirm${index}.accept`),
      style: 'destructive',
    },

    decline: {
      text: t('settings.clearData.confirm.cancel'),
      style: 'cancel',
      isPreferred: true,
    },
  });

  return (
    <FullScreenLayout
      title={t('settings.clearData.heading')}
      canGoBack={!mutation.isPending}
    >
      <View style={styles.root}>
        <Text>
          {t('settings.clearData.description')}
        </Text>

        <Button
          status="danger"
          disabled={mutation.isPending}
          style={styles.button}

          onPress={async () => {
            if (!await isConfirmed(1)) return;
            if (!await isConfirmed(2)) return;
            mutation.mutate();
          }}
        >
          {textRenderer(t('settings.clearData.clear'))}
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
