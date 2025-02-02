import { useSuspenseQuery } from '@tanstack/react-query';
import { BALANCE_QUERY } from '../keys';
import { records, sum, useDatabase } from '@/db';
import { RecordType } from '@/enums';

export function useBalanceSuspenseQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: BALANCE_QUERY,

    async queryFn() {
      const [row1, row2] = await db
        .select({
          type: records.type,
          total: sum(records.value).as('total'),
        })
        .from(records)
        .groupBy(records.type);

      const income = row1?.type === RecordType.INCOME ? row1.total : row2?.total;
      const expense = row1?.type === RecordType.EXPENSE ? row1.total : row2?.total;

      return { balance: (income ?? 0) - (expense ?? 0) };
    },
  });
}
