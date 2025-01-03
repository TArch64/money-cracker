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

const isPresent = (value: number | undefined) => value !== undefined;

export function eqDate<C extends AnyColumn<OperatorConfig>>(column: C, matcher: IEqDateMatcher) {
  const isFullEq = matcher.year && matcher.month && matcher.day;

  const year = isPresent(matcher.year) ? matcher.year.toString() : '%';
  const month = isPresent(matcher.month) ? (matcher.month + 1).toString().padStart(2, '0') : '%';
  const day = isPresent(matcher.day) ? matcher.day.toString().padStart(2, '0') : '%';
  const expression = `${year}-${month}-${day}`;

  // language=SQL format=false
  return isFullEq ? sql`${column} = ${expression}` : sql`${column} LIKE ${expression}`;
}
