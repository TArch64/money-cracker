import type { FormInitialValuesHandler } from '@/components/form';
import type { BudgetSchema } from './schema';
import { keyBy } from 'lodash-es';

export function useBudgetInitialValuesChange(): FormInitialValuesHandler<BudgetSchema> {
  return (form, newValues) => {
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
}
