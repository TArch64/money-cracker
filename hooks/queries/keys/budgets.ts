export const BUDGET_DETAILS_QUERY = (id: number) => ['budgets', id] as const;

type MonthKey = [string, string, year: number, string, month: number];

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
  ] as const;
}
