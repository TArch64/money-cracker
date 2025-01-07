type MonthKey = [string, string, year: number, string, month: number, string];

export function BUDGET_MONTH_QUERY(date: Date): MonthKey;
export function BUDGET_MONTH_QUERY(year: number, month: number): MonthKey;

export function BUDGET_MONTH_QUERY(yearOrDate: number | Date, month?: number): MonthKey {
  const date = yearOrDate instanceof Date ? yearOrDate : undefined;

  return [
    'budgets',
    'year',
    date?.getFullYear() ?? yearOrDate as number,
    'month',
    date?.getMonth() ?? month!,
    'list',
  ] as const;
}
