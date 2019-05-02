export interface Unit {
  number: number;
  timestamp: Date;
}

export interface DateHierarchy {
  [year: string]: {
    [month: string]: Unit[];
  };
}

export abstract class Utilities {
  protected rules: object;
  private collection: DateHierarchy;
  private array: Unit[];
  private latest: Unit | undefined;

  constructor() {
    this.collection = {};
    this.array = [];
    this.rules = { number: 0 };
  }

  public addCollection(u: Unit, date?: Date) {
    if (!date) {
      date = new Date(u.timestamp);
    }

    const year = date.getUTCFullYear().toString();
    const month = date.getUTCMonth().toString();

    if (!this.collection[year]) {
      this.collection[year] = {};
    }
    if (!this.collection[year][month]) {
      this.collection[year][month] = [];
    }

    this.collection[year][month].push(u);
    this.array.push(u);
    this.latest = u;
  }

  public saveRule(rule: object) {
    this.rules = rule;
  }

  public getLatest() {
    return this.latest;
  }

  public getMonthlyPrice(year?: number, month?: number /* 0-11 */) {
    const currentDate = new Date();

    const currentMonth = month || currentDate.getUTCMonth();
    const currentYear = year || currentDate.getUTCFullYear();

    const collectData = this.collection[currentYear][currentMonth];

    return this.calculatePrice(
      collectData.reduce((p, c) => {
        return p + c.number;
      }, 0),
    );
  }

  public getTotalPrice() {
    return this.calculatePrice(
      this.array.reduce((p, c) => {
        return p + c.number;
      }, 0),
    );
  }

  public list() {
    return this.array;
  }

  public length() {
    return this.array.length;
  }

  public abstract calculatePrice(unit: number): number;
}
