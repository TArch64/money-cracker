import { integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export function dateUnix(dateColumn: string) {
  // language=SQL format=false
  const expression = sql`UNIXEPOCH(${sql.raw(dateColumn)})`;
  return integer().generatedAlwaysAs(expression, { mode: 'stored' });
}
