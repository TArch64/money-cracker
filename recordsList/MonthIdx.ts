export class MonthIdx {
  static current(): MonthIdx {
    const now = new Date();
    return new MonthIdx(now.getFullYear(), now.getMonth());
  }

  constructor(
    readonly year: number,
    readonly month: number,
  ) {
  }

  get id(): string {
    return `${this.year}-${this.month}`;
  }

  get title(): string {
    return new Date(this.year, this.month).toLocaleString('default', { month: 'long' });
  }

  get previous(): MonthIdx {
    if (this.month === 0) {
      return new MonthIdx(this.year - 1, 11);
    }

    return new MonthIdx(this.year, this.month - 1);
  }

  get next(): MonthIdx {
    if (this.month === 11) {
      return new MonthIdx(this.year + 1, 0);
    }

    return new MonthIdx(this.year, this.month + 1);
  }

  isBeforeDate(date: Date): boolean {
    return this.year < date.getFullYear() || (this.year === date.getFullYear() && this.month < date.getMonth());
  }

  isAfterDate(date: Date): boolean {
    return this.year > date.getFullYear() || (this.year === date.getFullYear() && this.month > date.getMonth());
  }
}
