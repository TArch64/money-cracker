import { type QueryKey, useSuspenseQuery } from '@tanstack/react-query';
import { categories, eqDate, records, type RecordWithCategory, useDatabase } from '@/db';
import { and, desc, eq, getTableColumns } from 'drizzle-orm';
import { RECORDS_MONTH_LIST_QUERY } from './keys';
import { RecordType } from '@/enums';

export interface IRecordsMonthFilter {
  type?: RecordType;
}

export interface IRecordsMonthOptions<D = RecordWithCategory[]> {
  year: number;
  month: number;
  subkey?: QueryKey;
  filter?: IRecordsMonthFilter;
  select?: (data: RecordWithCategory[]) => D;
}

export function useRecordsMonthSuspenseQuery<D = RecordWithCategory[]>(options: IRecordsMonthOptions<D>) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: [
      ...RECORDS_MONTH_LIST_QUERY(options.year, options.month),
      ...(options.subkey || []),
    ],

    async queryFn(args): Promise<RecordWithCategory[]> {
      const [, , year, , month] = args.queryKey as ReturnType<typeof RECORDS_MONTH_LIST_QUERY>;

      let where = eqDate(records.date, { year, month });

      if (options.filter?.type) {
        where = and(where, eq(records.type, options.filter.type))!;
      }

      return db
        .select({ ...getTableColumns(records), category: categories })
        .from(records)
        .where(where)
        .innerJoin(categories, eq(categories.id, records.categoryId))
        .orderBy(desc(records.date));
    },

    select: options.select,
  });
}
