export const BUDGET_DETAILS_QUERY = (id: number) => ['budgets', id] as const;
export const BUDGET_MONTH_QUERY = (year: number, month: number) => ['budgets', 'year', year, 'month', month] as const;
export const BUDGET_PREVIOUS_MONTH_QUERY = (year: number, month: number) => [...BUDGET_MONTH_QUERY(year, month), 'previous'] as const;
