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

export function getRecordTypeTitle(type: RecordType): string {
  return isIncomeRecord(type) ? 'Income' : 'Expense';
}
