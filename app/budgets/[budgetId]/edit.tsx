import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button, Text } from '@ui-kitten/components';
import { useBudgetIdSuspenseQuery, useBudgetUpdateMutation, useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BudgetForm, budgetSchema, type FormBudgetCategory, useBudgetFormSubmit } from '@/components/budgetForm';

const schema = budgetSchema();

export default function Edit(): ReactNode {
  const searchParams = useLocalSearchParams<{ budgetId: string }>();
  const router = useRouter();
  const budget = useBudgetIdSuspenseQuery(Number(searchParams.budgetId));
  const updateMutation = useBudgetUpdateMutation();

  const categoriesQuery = useCategoriesListSuspenseQuery({
    type: RecordType.EXPENSE,
  });

  const initialCategories = useMemo(() => {
    const budgetCategoriesMap = Object.fromEntries(
      budget.data!.categories.map((category) => [category.categoryId, category]),
    );

    return categoriesQuery.data.map((category): FormBudgetCategory => ({
      id: category.id,
      added: !!budgetCategoriesMap[category.id],
      goal: budgetCategoriesMap[category.id]?.goal ?? 0,
    }));
  }, [categoriesQuery.data]);

  const onSubmit = useBudgetFormSubmit(async (categories) => {
    await updateMutation.mutateAsync({
      id: budget.data.id,
      categories,
    });

    router.back();
  });

  return (
    <FormScreenLayout
      fullScreen
      schema={schema}
      title="Edit Budget"
      initialValues={{ categories: initialCategories }}

      submit={({ submit, disabled }) => (
        <Button disabled={disabled} onPress={submit}>
          {textProps => <Text {...textProps}>Save Budget</Text>}
        </Button>
      )}

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
