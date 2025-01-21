import type { AnyColumn } from 'drizzle-orm/column';
import { SQLiteSyncDialect } from 'drizzle-orm/sqlite-core';
import { sql, type SQLWrapper } from 'drizzle-orm';

export interface IBulkUpdateInput<U extends object> {
  idColumn: AnyColumn<{ data: number }>;
  columns: { [K in keyof U]: AnyColumn<{ data: U[K] }> };
  updates: U[];
  where?: SQLWrapper;
}

export function bulkUpdate<U extends object>(input: IBulkUpdateInput<U>): SQLWrapper {
  const idColumnName = input.idColumn.name as keyof U;
  const idColumnSql = sql.raw(idColumnName as string);
  const query = sql`WITH updates(id`;

  const updatableKeys = Object.keys(input.columns)
    .filter((name) => name !== idColumnName) as (keyof U)[];

  for (const key of updatableKeys) {
    query.append(sql`,
    ${sql.raw(key as string)}`);
  }

  query.append(sql`) AS (VALUES `);

  for (const [index, update] of input.updates.entries()) {
    query.append(sql`(
    ${update[idColumnName]}`);

    for (const key of updatableKeys) {
      query.append(sql`,
      ${update[key]}`);
    }

    query.append(index === input.updates.length - 1 ? sql`)` : sql`), `);
  }

  query.append(sql`)
  UPDATE ${input.idColumn.table}
  SET `);

  query.append(sql.join(updatableKeys.map((name) => {
    const nameSql = sql.raw(name as string);
    return sql`${nameSql} = updates.
    ${nameSql}`;
  }), sql`, `));

  query.append(sql` FROM updates WHERE
  ${idColumnSql}
  =
  updates
  .
  id`);

  if (input.where) {
    query.append(sql` AND (
    ${input.where}
    )`);
  }

  const { sql: sql_, params } = new SQLiteSyncDialect().sqlToQuery(query);
  console.log('sql', sql_);
  console.log('params', params);

  return query;
}
