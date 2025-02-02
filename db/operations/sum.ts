import { sql, type SQL } from 'drizzle-orm';
import type { AnyColumn } from 'drizzle-orm/column';

export function sum(column: AnyColumn<{ data: number }>): SQL<number> {
  return sql`SUM(${column})`;
}
