import { integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export function dateUnix(dateColumn: string) {
  return integer().generatedAlwaysAs(sql`UNIXEPOCH(
  ${sql.raw(dateColumn)}
  )`, { mode: 'stored' });
}
