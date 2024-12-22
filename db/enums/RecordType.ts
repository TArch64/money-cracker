export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export const recordTypeEnum = Object.values(RecordType) as [RecordType, ...RecordType[]];
