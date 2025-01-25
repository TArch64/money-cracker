export const RECORDS_DETAILS_QUERY = (recordId: number) => ['records', recordId, 'details'] as const;

type MonthListKey = [string, string, year: number, string, month: number, string];

export function RECORDS_MONTH_LIST_QUERY(date: Date): MonthListKey;
export function RECORDS_MONTH_LIST_QUERY(year: number, month: number): MonthListKey;

export function RECORDS_MONTH_LIST_QUERY(yearOrDate: number | Date, month?: number): MonthListKey {
  const date = yearOrDate instanceof Date ? yearOrDate : undefined;

  return [
    'records',
    'year',
    date?.getFullYear() ?? yearOrDate as number,
    'month',
    date?.getMonth() ?? month!,
    'list',
  ] as const;
}

type MonthStatisticsQuery = [...MonthListKey, string];

export function RECORDS_MONTH_STATISTICS_QUERY(year: number, month: number): MonthStatisticsQuery {
  return [...RECORDS_MONTH_LIST_QUERY(year, month), 'statistics'];
}
