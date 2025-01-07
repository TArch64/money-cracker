import { type QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { categories, eqDate, records, type RecordWithCategory, useDatabase } from '@/db';
import { and, desc, eq, getTableColumns, or } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from './keys';
import { RecordType } from '@/enums';
import { useDataLoader } from '@/hooks/useDataLoader';
import { groupBy } from 'lodash-es';

export interface IRecordsMonthOptions<D = RecordWithCategory[]> {
  year: number;
  month: number;
  subkey?: QueryKey;
  select?: (data: RecordWithCategory[]) => D;
}

type RecordsBatchKey = [year: number, month: number];
const RECORDS_DATA_LOADER = Symbol('RECORDS_MONTH_DATA_LOADER');
const EXPENSES_DATA_LOADER = Symbol('EXPENSES_MONTH_DATA_LOADER');

export function useRecordsMonthSuspenseQuery<D = RecordWithCategory[]>(options: IRecordsMonthOptions<D>) {
  const db = useDatabase();

  const dataLoader = useDataLoader(RECORDS_DATA_LOADER, async (idxes: readonly RecordsBatchKey[]): Promise<RecordWithCategory[][]> => {
    const categories_ = await db
      .select({ ...getTableColumns(records), category: categories })
      .from(records)
      .where(or(...idxes.map(([year, month]) => eqDate(records.date, { year, month }))))
      .innerJoin(categories, eq(categories.id, records.categoryId))
      .orderBy(desc(records.date));

    const grouped = groupBy(categories_, (record) => {
      return `${record.date.getFullYear()}-${record.date.getMonth()}`;
    });

    return idxes.map(([year, month]) => grouped[`${year}-${month}`] || []);
  });

  return useSuspenseQuery({
    queryKey: [
      ...RECORDS_MONTH_LIST_QUERY(options.year, options.month),
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey as ReturnType<typeof RECORDS_MONTH_LIST_QUERY>;
      return dataLoader.load([year, month]);
    },

    select: options.select,
  });
}

export function useExpensesMonthSuspenseQuery<D = RecordWithCategory[]>(options: IRecordsMonthOptions<D>) {
  const db = useDatabase();

  const dataLoader = useDataLoader(EXPENSES_DATA_LOADER, async (idxes: readonly RecordsBatchKey[]): Promise<RecordWithCategory[][]> => {
    const categories_ = await db
      .select({ ...getTableColumns(records), category: categories })
      .from(records)
      .where(and(
        eq(records.type, RecordType.EXPENSE),
        or(...idxes.map(([year, month]) => eqDate(records.date, { year, month }))),
      ))
      .innerJoin(categories, eq(categories.id, records.categoryId))
      .orderBy(desc(records.date));

    return Object.values(
      groupBy(categories_, (record) => {
        return `${record.date.getFullYear()}-${record.date.getMonth()}`;
      }),
    );
  });

  return useSuspenseQuery({
    queryKey: [
      ...RECORDS_MONTH_LIST_QUERY(options.year, options.month),
      'expenses',
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey as ReturnType<typeof RECORDS_MONTH_LIST_QUERY>;
      return dataLoader.load([year, month]);
    },

    select: options.select,
  });
}
