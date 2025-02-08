import type { AppDatabase } from '@/db/Provider';
import { categories, type RecordInsert, records, users } from './schema';
import { IntroState, RecordType } from '@/enums';
import { MonthIdx } from '@/stores';

function getDateRange(): MonthIdx[] {
  const currentIdx = MonthIdx.current();
  const range = [currentIdx];

  for (let index = 0; index < 10; index++) {
    range.unshift(range[0].previous);
  }

  return range;
}

function getRecordValues(): number[] {
  const count = Math.floor(Math.random() * 10) + 5;
  return new Array(count).fill(0).map(() => 100 + Math.floor(Math.random() * 2_000));
}

function getMonthDays(idx: MonthIdx): Date[] {
  const lastDay = new Date(idx.date.getFullYear(), idx.date.getMonth(), 0).getDate();

  return new Array(lastDay)
    .fill(0)
    .map((_, index) => new Date(idx.date.getFullYear(), idx.date.getMonth(), index + 1));
}

export async function runSeeds(db: AppDatabase): Promise<void> {
  if (!!await db.$count(categories)) {
    return;
  }

  await db.transaction(async (tx) => {
    const monthIdxes = getDateRange();

    const [incomeCategory, ...expenseCategories] = await tx.insert(categories)
      .values([
        { type: RecordType.INCOME, name: 'Зарплата' },
        { type: RecordType.EXPENSE, name: 'Продукти' },
        { type: RecordType.EXPENSE, name: 'Транспорт' },
        { type: RecordType.EXPENSE, name: 'Розваги' },
        { type: RecordType.EXPENSE, name: 'Одяг' },
        { type: RecordType.EXPENSE, name: 'Кредити' },
        { type: RecordType.EXPENSE, name: 'Донати' },
        { type: RecordType.EXPENSE, name: 'Інше' },
      ])
      .returning({ id: categories.id });

    await tx.insert(records).values([
      ...monthIdxes.map((idx): RecordInsert => ({
        categoryId: incomeCategory.id,
        type: RecordType.INCOME,
        date: idx.date,
        value: 350_000,
      })),

      ...monthIdxes.flatMap((idx) =>
        getMonthDays(idx).flatMap((date) =>
          getRecordValues().flatMap((value): RecordInsert => ({
            categoryId: expenseCategories[Math.floor(Math.random() * expenseCategories.length)].id,
            type: RecordType.EXPENSE,
            date,
            value,
          })))),
    ]);

    await tx
      .update(users)
      .set({ intro: IntroState.COMPLETED });
  });
}
