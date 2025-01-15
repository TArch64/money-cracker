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

  get date(): Date {
    return new Date(this.year, this.month);
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

  isEqual(other: MonthIdx): boolean {
    return this.year === other.year && this.month === other.month;
  }
}
