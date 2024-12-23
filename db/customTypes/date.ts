import { sql } from 'drizzle-orm';
import { customType } from 'drizzle-orm/sqlite-core';
import type { AnyColumn } from 'drizzle-orm/column';

interface ColumnConfig {
  data: Date;
  driverData: string;
}

interface OperatorConfig {
  data: Date;
}

/**
 * Date functions spec https://www.sqlite.org/lang_datefunc.html
 */
export const date = customType<ColumnConfig>({
  dataType() {
    return 'text';
  },

  toDriver(data) {
    const month = (data.getMonth() + 1).toString().padStart(2, '0');
    const date = data.getDate().toString().padStart(2, '0');
    return `${data.getFullYear()}-${month}-${date}`;
  },

  fromDriver(data) {
    const [year, month, day] = data.split('-');
    return new Date(+year, (+month) - 1, +day);
  },
});

export interface IEqDateMatcher {
  year?: number;
  month?: number;
  day?: number;
}

export function eqDate<C extends AnyColumn<OperatorConfig>>(column: C, matcher: IEqDateMatcher) {
  const operator = matcher.year && matcher.month && matcher.day ? '=' : 'LIKE';

  const year = matcher.year ? matcher.year.toString() : '%';
  const month = matcher.month ? (matcher.month + 1).toString().padStart(2, '0') : '%';
  const day = matcher.day ? matcher.day.toString().padStart(2, '0') : '%';

  return sql`${column}
  ${operator}
  ${year}
  -
  ${month}
  -
  ${day}`;
}
