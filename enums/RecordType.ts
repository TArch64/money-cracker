import { maybeFn, type MaybeFn } from '@/helpers/maybeFn';

export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export function getRecordTypeValue<V>(type: RecordType, map: Record<RecordType, MaybeFn<V>>): V {
  return maybeFn(map[type]);
}

export function isExpenseRecord(type: RecordType): boolean {
  return type === RecordType.EXPENSE;
}

export function isIncomeRecord(type: RecordType): boolean {
  return type === RecordType.INCOME;
}

export const getRecordTypeTitle = (type: RecordType) => getRecordTypeValue(type, {
  [RecordType.INCOME]: 'Income',
  [RecordType.EXPENSE]: 'Expense',
});
