import { asc, desc } from 'drizzle-orm';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { type AppDatabase, records, useDatabase } from '@/db';

export const RECORDS_BOUNDARIES_QUERY = ['records', 'boundaries'] as const;

export interface IRecordsBoundaries {
  min: Date;
  max: Date;
}

export async function getRecordsBoundaries(db: AppDatabase): Promise<IRecordsBoundaries> {
  const commonQuery = () => db.select({ date: records.date }).from(records).limit(1);

  const [min, max] = await Promise.all([
    commonQuery().orderBy(asc(records.dateUnix)),
    commonQuery().orderBy(desc(records.dateUnix)),
  ]);

  return { min: min[0].date, max: max[0].date };
}

export function usePrefetchRecordsBoundariesQuery(): () => Promise<void> {
  const db = useDatabase();
  const queryClient = useQueryClient();

  return () => queryClient.prefetchQuery({
    queryKey: RECORDS_BOUNDARIES_QUERY,
    queryFn: () => getRecordsBoundaries(db),
  });
}

export function useRecordsBoundariesQuery() {
  const db = useDatabase();

  return useSuspenseQuery({
    queryKey: RECORDS_BOUNDARIES_QUERY,
    queryFn: () => getRecordsBoundaries(db),
  });
}
