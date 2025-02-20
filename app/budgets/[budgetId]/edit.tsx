import { type ReactNode, useMemo } from 'react';
import { Button } from '@ui-kitten/components';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import {
  useBudgetDetailsSuspenseQuery,
  useBudgetUpdateMutation,
  useCategoriesListSuspenseQuery,
} from '@/hooks/queries';
import { RecordType } from '@/enums';
import {
  BudgetForm,
  budgetSchema,
  type FormBudgetCategory,
  useBudgetFormSubmit,
  useBudgetInitialValuesChange,
} from '@/components/budgetForm';

const schema = budgetSchema();

export default function Edit(): ReactNode {
  const searchParams = useLocalSearchParams<{ budgetId: string }>();
  const { t } = useTranslation();
  const router = useRouter();
  const budget = useBudgetDetailsSuspenseQuery(Number(searchParams.budgetId));
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
      schema={schema}
      title={t('budgets.edit.title')}
      initialValues={{ categories: initialCategories }}
      submit={t('budgets.edit.save')}
      onInitialValuesChange={onInitialValuesChange}
      onSubmit={onSubmit}
    >
      {() => (
        <ScrollView contentContainerStyle={styles.list}>
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
              {t('budgets.newCategory')}
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
