import { type ReactNode, useMemo } from 'react';
import { useCategoriesListSuspenseQuery } from '@/hooks/queries';
import { RecordType } from '@/enums';
import { FormArray } from '../form';
import type { FormBudgetCategory } from './schema';
import { BudgetFormCategory } from './BudgetFormCategory';

export function BudgetForm(): ReactNode {
  const categoriesQuery = useCategoriesListSuspenseQuery({
    type: RecordType.EXPENSE,
  });

  const categoryIdMap = useMemo(() => Object.fromEntries(
    categoriesQuery.data.map((category) => [category.id, category]),
  ), [categoriesQuery.data]);

  return (
    <FormArray<FormBudgetCategory> name="categories">
      {({ item, itemName }) => (
        <BudgetFormCategory
          key={item.id}
          category={categoryIdMap[item.id]}
          formPath={itemName}
          formCategory={item}
        />
      )}
    </FormArray>
  );
}
