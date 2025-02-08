export const RECORDS_DETAILS_QUERY = (recordId: number) => ['records', recordId, 'details'] as const;

export const RECORDS_MONTH_LIST_QUERY = (year: number, month: number) => [
  'records',
  'year',
  year,
  'month',
  month,
  'list',
] as const;

export const RECORDS_MONTH_SUMMARY_QUERY = (year: number, month: number) => [
  ...RECORDS_MONTH_LIST_QUERY(year, month),
  'summary',
] as const;

export const RECORDS_MONTH_STATISTICS_QUERY = (year: number, month: number) => [
  ...RECORDS_MONTH_LIST_QUERY(year, month),
  'statistics',
] as const;

