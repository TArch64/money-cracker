import { text } from 'drizzle-orm/sqlite-core';

interface Enum {
  [key: string]: string;
}

export function enum_<const TEnum extends Enum>(enum__: TEnum) {
  return text({ enum: Object.values(enum__) as [TEnum[keyof TEnum], ...TEnum[keyof TEnum][]] });
}
