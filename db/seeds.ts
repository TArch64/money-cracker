import type { AppDatabase } from '@/db/Provider';
import { categories, type RecordInsert, records } from './schema';
import { RecordType } from '@/enums';
import { MonthIdx } from '@/stores';

function getDateRange(): MonthIdx[] {
  const currentIdx = MonthIdx.current();
  const range = [currentIdx];

  for (let index = 0; index < 5; index++) {
    range.unshift(range[0].previous);
  }

  return range;
}

function getRecordValues(): number[] {
  const count = Math.floor(Math.random() * 10) + 10;
  return new Array(count).fill(0).map(() => 100 + Math.floor(Math.random() * 5_000));
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

    return tx.insert(records).values([
      ...monthIdxes.map((idx): RecordInsert => ({
        categoryId: incomeCategory.id,
        type: RecordType.INCOME,
        date: idx.date,
        value: 100_000,
      })),

      ...monthIdxes.flatMap((idx) => {
        return getRecordValues().map((value): RecordInsert => ({
          categoryId: expenseCategories[Math.floor(Math.random() * expenseCategories.length)].id,
          type: RecordType.EXPENSE,
          date: idx.date,
          value,
        }));
      }),
    ]);
  });
}
