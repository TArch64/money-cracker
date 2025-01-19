import type { FormSubmitHandler } from '../form';
import type { BudgetSchema } from './schema';
import { showAlert } from '@/helpers/showAlert';
import type { BudgetCreateCategory } from '@/hooks/queries';

export function useBudgetFormSubmit(onSubmit: (categories: BudgetCreateCategory[]) => void): FormSubmitHandler<BudgetSchema> {
  return (event) => {
    const addedCategories = event.value.categories.filter((category) => category.added);

    if (!addedCategories.length) {
      return showAlert({
        title: 'Error',
        message: 'Please select at least one category',
      });
    }

    return onSubmit(addedCategories.map((category) => ({
      categoryId: category.id,
      goal: category.goal,
    })));
  };
}
