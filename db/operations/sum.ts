import { sql, type SQL } from 'drizzle-orm';
import type { AnyColumn } from 'drizzle-orm/column';

export function sum(column: AnyColumn<{ data: number }>, as: string): SQL<number> {
  // language=SQL format=false
  return sql`SUM(${column}) AS ${sql.raw(as)}`;
}
