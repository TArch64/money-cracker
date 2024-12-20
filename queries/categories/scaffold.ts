import { useCategoriesCreate } from './create';
import { RecordType } from '@/db';
import { useMutation } from '@tanstack/react-query';

export function useCategoriesScaffoldMutation() {
  const income = useCategoriesCreate(RecordType.INCOME);
  const expense = useCategoriesCreate(RecordType.EXPENSE);

  return useMutation({
    async mutationFn() {
      return Promise.all([
        income.mutate([
          { name: 'Salary' },
          { name: 'Freelance' },
          { name: 'Investments' },
          { name: 'Rental Income' },
          { name: 'Side Gigs' },
          { name: 'Gifts' },
          { name: 'Other Income' },
        ]),
        expense.mutate([
          { name: 'Rent/Mortgage' },
          { name: 'Utilities' },
          { name: 'Groceries' },
          { name: 'Dining Out' },
          { name: 'Transportation' },
          { name: 'Healthcare' },
          { name: 'Shopping' },
          { name: 'Entertainment' },
          { name: 'Subscriptions' },
          { name: 'Insurance' },
          { name: 'Education' },
          { name: 'Savings' },
          { name: 'Debt Payments' },
          { name: 'Personal Care' },
          { name: 'Gifts & Donations' },
          { name: 'Other Expenses' },
        ]),
      ]);
    },
  });
}
