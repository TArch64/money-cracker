import { customType } from 'drizzle-orm/sqlite-core';

// Successfully stolen this types from valibot

interface Enum {
  [key: string]: string | number;
}

type EnumValues<TEnum extends Enum> = {
  [TKey in keyof TEnum]: TKey extends number ? TEnum[TKey] extends string ? TEnum[TEnum[TKey]] extends TKey ? never : TEnum[TKey] : TEnum[TKey] : TKey extends 'NaN' | 'Infinity' | '-Infinity' ? TEnum[TKey] extends string ? TEnum[TEnum[TKey]] extends number ? never : TEnum[TKey] : TEnum[TKey] : TKey extends `+${number}` ? TEnum[TKey] : TKey extends `${infer TNumber extends number}` ? TEnum[TKey] extends string ? TEnum[TEnum[TKey]] extends TNumber ? never : TEnum[TKey] : TEnum[TKey] : TEnum[TKey];
}[keyof TEnum];


interface IColumnConfig<TEnum extends Enum> {
  data: EnumValues<TEnum>;
  driverData: string;
}

// TODO there are should be a way to get column name automatically. Maybe by inheriting SQLiteColumnBuilder
export function enum_<const TEnum extends Enum>(name: string, enum__: TEnum) {
  const values = Object.values(enum__).map((value) => `'${value}'`).join(', ');

  return customType<IColumnConfig<TEnum>>({
    dataType: () => `TEXT CHECK(${name} IN (${values}))`,
  })();
}
