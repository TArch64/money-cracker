import { type QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { categories, eqDate, records, type RecordWithCategory, useDatabase } from '@/db';
import { desc, eq, getTableColumns } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from '../keys';
import { useIsFocused } from '@react-navigation/core';

export interface IRecordsMonthOptions<D = RecordWithCategory[]> {
  year: number;
  month: number;
  subkey?: QueryKey;
  limit?: number;
  select?: (data: RecordWithCategory[]) => D;
}

export function useRecordsMonthSuspenseQuery<D = RecordWithCategory[]>(options: IRecordsMonthOptions<D>) {
  const db = useDatabase();
  const isFocused = useIsFocused();

  return useSuspenseQuery({
    subscribed: isFocused,

    queryKey: [
      ...RECORDS_MONTH_LIST_QUERY(options.year, options.month),
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey as ReturnType<typeof RECORDS_MONTH_LIST_QUERY>;

      let query = db
        .select({ ...getTableColumns(records), category: categories })
        .from(records)
        .where(eqDate(records.date, { year, month }))
        .innerJoin(categories, eq(categories.id, records.categoryId))
        .orderBy(desc(records.date));

      if (options.limit) {
        // @ts-expect-error
        query = query.limit(options.limit);
      }

      return query;
    },

    select: options.select,
  });
}
