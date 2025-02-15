import { showAlert } from '@/helpers/showAlert';
import type { BudgetInputCategory } from '@/hooks/queries';
import type { FormSubmitHandler } from '../form';
import type { BudgetSchema } from './schema';

export function useBudgetFormSubmit(onSubmit: (categories: BudgetInputCategory[]) => void): FormSubmitHandler<BudgetSchema> {
  return (event) => {
    const isAnyCategoryAdded = event.value.categories.some((category) => category.added);

    if (!isAnyCategoryAdded) {
      return showAlert({
        title: 'Error',
        message: 'Please select at least one category',
      });
    }

    return onSubmit(event.value.categories.map((category) => ({
      categoryId: category.id,
      goal: category.goal,
      added: category.added,
    })));
  };
}
