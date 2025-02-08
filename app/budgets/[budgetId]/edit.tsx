import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button } from '@ui-kitten/components';
import {
  useBudgetDetailsSuspenseQuery,
  useBudgetUpdateMutation,
  useCategoriesListSuspenseQuery,
} from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  BudgetForm,
  budgetSchema,
  type FormBudgetCategory,
  useBudgetFormSubmit,
  useBudgetInitialValuesChange,
} from '@/components/budgetForm';

export default function Edit(): ReactNode {
  const searchParams = useLocalSearchParams<{ budgetId: string }>();
  const router = useRouter();
  const budget = useBudgetDetailsSuspenseQuery(Number(searchParams.budgetId));
  const updateMutation = useBudgetUpdateMutation();
  const schema = useMemo(() => budgetSchema(), []);

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

  const onInitialValuesChange = useBudgetInitialValuesChange();

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
      title="Edit Spending Goals"
      initialValues={{ categories: initialCategories }}
      submit="Save Goals"
      onInitialValuesChange={onInitialValuesChange}
      onSubmit={onSubmit}
    >
      {() => (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          <Link
            asChild
            href={{
              pathname: '/categories/new',
              params: { type: RecordType.EXPENSE },
            }}
          >
            <Button
              size="inline"
              appearance="link"
              style={styles.addNewCategory}
            >
              Add New Category
            </Button>
          </Link>

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

  addNewCategory: {
    alignSelf: 'flex-start',
  } satisfies ViewStyle,
});
