import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Text } from '@ui-kitten/components';
import { useBudgetCreateMutation, useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { useMonthStore } from '@/stores';
import { useRouter } from 'expo-router';
import { BudgetForm, budgetSchema, type FormBudgetCategory, useBudgetFormSubmit } from '@/components/budgetForm';

const schema = budgetSchema();

export default function New(): ReactNode {
  const router = useRouter();
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const createMutation = useBudgetCreateMutation();

  const categoriesQuery = useCategoriesListSuspenseQuery({
    type: RecordType.EXPENSE,
  });

  const initialCategories = useMemo(() => (
    categoriesQuery.data.map((category): FormBudgetCategory => ({
      id: category.id,
      added: false,
      goal: 0,
    }))
  ), [categoriesQuery.data]);

  const onSubmit = useBudgetFormSubmit(async (categories) => {
    await createMutation.mutateAsync({
      monthIdx: activeMonthIdx,
      categories,
    });

    router.back();
  });

  return (
    <FormScreenLayout
      fullScreen
      schema={schema}
      title="New Budget"
      initialValues={{ categories: initialCategories }}
      submit={initialCategories.length ? 'Add Budget' : undefined}
      onSubmit={onSubmit}
    >
      {() => (
        <ScrollView contentContainerStyle={styles.list}>
          <Text category="p1">
            Select Categories
          </Text>

          <BudgetForm />
        </ScrollView>
      )}
    </FormScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  } satisfies ViewStyle,
});
