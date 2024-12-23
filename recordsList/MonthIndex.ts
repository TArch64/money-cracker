import type { DependencyList } from 'react';

export class MonthIndex {
  static current(): MonthIndex {
    const now = new Date();
    return new MonthIndex(now.getFullYear(), now.getMonth());
  }

  constructor(
    readonly year: number,
    readonly month: number,
  ) {
  }

  get title(): string {
    return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
  }

  get reactDeps(): DependencyList {
    return [this.year, this.month];
  }

  get previous(): MonthIndex {
    if (this.month === 0) {
      return new MonthIndex(this.year - 1, 11);
    }

    return new MonthIndex(this.year, this.month - 1);
  }

  get next(): MonthIndex {
    if (this.month === 11) {
      return new MonthIndex(this.year + 1, 0);
    }

    return new MonthIndex(this.year, this.month + 1);
  }

  isBeforeDate(date: Date): boolean {
    return this.year < date.getFullYear() || (this.year === date.getFullYear() && this.month < date.getMonth());
  }

  isAfterDate(date: Date): boolean {
    return this.year > date.getFullYear() || (this.year === date.getFullYear() && this.month > date.getMonth());
  }
}
