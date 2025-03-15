export class MonthIdx {
  static fromDate(date: Date): MonthIdx {
    return new MonthIdx(date.getFullYear(), date.getMonth());
  }

  static current(): MonthIdx {
    return this.fromDate(new Date());
  }

  readonly date: Date;

  constructor(
    readonly year: number,
    readonly month: number,
  ) {
    this.date = new Date(year, month);
  }

  get id(): string {
    return `${this.year}-${this.month}`;
  }

  get isFirstYearMonth(): boolean {
    return this.month === 0;
  }

  get isLastYearMonth(): boolean {
    return this.month === 11;
  }

  get previous(): MonthIdx {
    return this.isFirstYearMonth
      ? new MonthIdx(this.year - 1, 11)
      : new MonthIdx(this.year, this.month - 1);
  }

  get next(): MonthIdx {
    return this.isLastYearMonth
      ? new MonthIdx(this.year + 1, 0)
      : new MonthIdx(this.year, this.month + 1);
  }

  isEqual(other: MonthIdx): boolean {
    return this.year === other.year && this.month === other.month;
  }

  isBefore(other: MonthIdx): boolean {
    return this.year < other.year || (this.year === other.year && this.month < other.month);
  }

  isAfter(other: MonthIdx): boolean {
    return this.year > other.year || (this.year === other.year && this.month > other.month);
  }
}
