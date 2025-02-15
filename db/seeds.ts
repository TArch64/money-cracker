import { getDaysInMonth, setDate } from 'date-fns';
import type { AppDatabase } from '@/db/Provider';
import { IntroState, RecordType } from '@/enums';
import { MonthIdx } from '@/stores';
import {
  budgetCategories,
  type BudgetCategoryInsert,
  budgets,
  categories,
  type RecordInsert,
  records,
  users,
} from './schema';
import seedsData from './seeds.json';

function getDateRange(): MonthIdx[] {
  const range = [MonthIdx.current()];

  for (let index = 0; index < 2; index++) {
    range.unshift(range[0].previous);
  }

  return range;
}

export async function runSeeds(db: AppDatabase): Promise<void> {
  if (await db.$count(categories)) {
    return;
  }

  await db.transaction(async (tx) => {
    const monthIdxes = getDateRange();

    const [incomeCategory, ...expenseCategories] = await tx.insert(categories)
      .values([
        { type: RecordType.INCOME, name: 'Зарплата' },
        { type: RecordType.EXPENSE, name: 'Їжа' },
        { type: RecordType.EXPENSE, name: 'Транспорт' },
        { type: RecordType.EXPENSE, name: 'Розваги' },
        { type: RecordType.EXPENSE, name: 'Одяг' },
        { type: RecordType.EXPENSE, name: 'Кредити' },
        { type: RecordType.EXPENSE, name: 'Донати' },
        { type: RecordType.EXPENSE, name: 'Здоровʼя' },
        { type: RecordType.EXPENSE, name: 'Житло' },
        { type: RecordType.EXPENSE, name: 'Інше' },
      ])
      .returning();

    const expenseCategoriesMap = Object.fromEntries(expenseCategories.map((category) => [category.name, category]));

    await tx.insert(records).values(monthIdxes.flatMap((monthIdx, index): RecordInsert[] => [
      {
        categoryId: incomeCategory.id,
        type: RecordType.INCOME,
        date: setDate(monthIdx.date, 5),
        value: 130_000,
      },
      ...seedsData.expenses[index]
        .filter((data) => getDaysInMonth(monthIdx.date) > data.day)
        .map((data): RecordInsert => ({
          categoryId: expenseCategoriesMap[data.category].id,
          type: RecordType.EXPENSE,
          date: setDate(monthIdx.date, data.day),
          value: data.value,
        })),
    ]));

    const budgets_ = await tx
      .insert(budgets)
      .values(monthIdxes.map((monthIdx) => ({
        year: monthIdx.year,
        month: monthIdx.month,
      })))
      .returning();

    await tx
      .insert(budgetCategories)
      .values(budgets_.flatMap((budget) => {
        return seedsData.goals.map((data): BudgetCategoryInsert => ({
          categoryId: expenseCategoriesMap[data.category].id,
          budgetId: budget.id,
          goal: data.goal,
        }));
      }));

    await tx
      .update(users)
      .set({ intro: IntroState.COMPLETED });
  });
}
