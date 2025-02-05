import { sql, type SQL } from 'drizzle-orm';
import type { AnyColumn } from 'drizzle-orm/column';

export function sum(column: AnyColumn<{ data: number }>, defaultValue?: number): SQL<number> {
  return defaultValue !== undefined ? sql`COALESCE(SUM(${column}), 0)` : sql`SUM(${column})`;
}
