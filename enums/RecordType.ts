import type { i18n } from 'i18next';

export enum RecordType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export function isExpenseRecord(type: RecordType): boolean {
  return type === RecordType.EXPENSE;
}

export function isIncomeRecord(type: RecordType): boolean {
  return type === RecordType.INCOME;
}

export function getRecordTypeTitle(t: i18n['t'], type: RecordType): string {
  return t(`records.type.${type}`);
}
