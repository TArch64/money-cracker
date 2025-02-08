import { useSuspenseQuery } from '@tanstack/react-query';
import { RECORDS_MONTH_STATISTICS_QUERY } from '../keys';
import { categories, eqDate, records, sum, useDatabase } from '@/db';
import { and, desc, eq, sql } from 'drizzle-orm';
import { RecordType } from '@/enums';

export interface IRecordMonthStatistics {
  categoryId: number;
  categoryName: string;
  total: number;
}

export function useRecordsMonthStatisticsSuspenseQuery(year: number, month: number) {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_MONTH_STATISTICS_QUERY(year, month),

    async queryFn(args) {
      const [, , year, , month] = args.queryKey;

      return db
        .select({
          categoryId: categories.id,
          categoryName: categories.name,
          total: sum(records.value, 0).as('total'),
        })
        .from(records)
        .where(and(
          eq(records.type, RecordType.EXPENSE),
          eqDate(records.date, { year, month }),
        ))
        .innerJoin(categories, eq(records.categoryId, categories.id))
        .groupBy(categories.id)
        .orderBy(desc(sql`total`));
    },
  });
}
