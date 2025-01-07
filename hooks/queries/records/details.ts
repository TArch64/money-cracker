import { categories, records, type RecordWithCategory, useDatabase } from '@/db';
import { useSuspenseQuery } from '@tanstack/react-query';
import { eq, getTableColumns, inArray } from 'drizzle-orm';
import { RECORDS_DETAILS_QUERY } from './keys';
import { useDataLoader } from '@/hooks/useDataLoader';
import { keyBy, uniq } from 'lodash-es';

const DETAILS_LOADER = Symbol('RECORD_DETAILS_LOADER');

export function useRecordDetailsSuspenseQuery(recordId: number) {
  const db = useDatabase();

  const dataLoader = useDataLoader(DETAILS_LOADER, async (ids: readonly number[]): Promise<RecordWithCategory[]> => {
    const records_ = await db
      .select({ ...getTableColumns(records), category: categories })
      .from(records)
      .where(inArray(records.id, uniq(ids)))
      .innerJoin(categories, eq(categories.id, records.categoryId));

    const idMap = keyBy(records_, 'id');
    return ids.map((id) => idMap[id]);
  });

  return useSuspenseQuery({
    queryKey: RECORDS_DETAILS_QUERY(recordId),

    async queryFn(args): Promise<RecordWithCategory> {
      const [, recordId] = args.queryKey;
      return dataLoader.load(recordId);
    }
  });
}
