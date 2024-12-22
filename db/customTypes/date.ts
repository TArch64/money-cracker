import { customType } from 'drizzle-orm/sqlite-core';

/**
 * Date functions spec https://www.sqlite.org/lang_datefunc.html
 */
export const date = customType<{ data: Date, driverData: string }>({
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
