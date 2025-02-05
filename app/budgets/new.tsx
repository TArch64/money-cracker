import { type ReactNode, useMemo } from 'react';
import { FormScreenLayout } from '@/components/layout';
import { Button } from '@ui-kitten/components';
import { useBudgetCreateMutation, useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { useMonthStore } from '@/stores';
import { Link, useRouter } from 'expo-router';
import {
  BudgetForm,
  budgetSchema,
  type BudgetSchema,
  type FormBudgetCategory,
  useBudgetFormSubmit,
} from '@/components/budgetForm';
import type { FormInitialValuesHandler } from '@/components/form';
import { keyBy } from 'lodash-es';

export default function New(): ReactNode {
  const router = useRouter();
  const activeMonthIdx = useMonthStore((state) => state.activeIdx);
  const createMutation = useBudgetCreateMutation();
  const schema = useMemo(() => budgetSchema(), []);

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

  const onInitialValuesChange: FormInitialValuesHandler<BudgetSchema> = (form, newValues) => {
    const existingCategoryMap = keyBy(form.state.values.categories, 'id');

    const newCategories = newValues.categories.map((category) => {
      const existing = existingCategoryMap[category.id];

      return existing ? {
        ...category,
        added: existing.added,
        goal: existing.goal,
      } : category;
    });

    form.reset({ categories: newCategories });
  };

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
      title="New Spending Goals"
      initialValues={{ categories: initialCategories }}
      onInitialValuesChange={onInitialValuesChange}
      submit={initialCategories.length ? 'Add Goals' : undefined}
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
