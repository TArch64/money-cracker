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

  get position(): number {
    return +new Date(this.year, this.month);
  }
}
