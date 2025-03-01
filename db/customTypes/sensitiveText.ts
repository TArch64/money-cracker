import { customType } from 'drizzle-orm/sqlite-core';

interface ColumnConfig {
  data: string;
  driverData: string;
}

export const sensitiveText = customType<ColumnConfig>({
  dataType: () => 'text',
  toDriver: btoa,
  fromDriver: atob,
});
