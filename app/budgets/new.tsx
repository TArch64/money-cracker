import { type ReactNode, useMemo } from 'react';
import { Button } from '@ui-kitten/components';
import { ScrollView, StyleSheet, type ViewStyle } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FormScreenLayout } from '@/components/layout';
import { useBudgetCreateMutation, useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { useMonthStore } from '@/stores';
import {
  BudgetForm,
  budgetSchema,
  type FormBudgetCategory,
  useBudgetFormSubmit,
  useBudgetInitialValuesChange,
} from '@/components/budgetForm';

export default function New(): ReactNode {
  const router = useRouter();
  const { t } = useTranslation();
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

  const onInitialValuesChange = useBudgetInitialValuesChange();

  const onSubmit = useBudgetFormSubmit(async (categories) => {
    await createMutation.mutateAsync({
      monthIdx: activeMonthIdx,
      categories,
    });

    router.back();
  });

  return (
    <FormScreenLayout
      schema={schema}
      title={t('budgets.new.title')}
      initialValues={{ categories: initialCategories }}
      submit={initialCategories.length ? t('budgets.new.add') : undefined}
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
