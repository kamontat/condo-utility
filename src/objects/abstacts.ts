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
  protected rules: { [key: string]: any };
  private collection: DateHierarchy;
  private unitCollection: { [key: string]: Unit };
  private latest: Unit | undefined;

  constructor() {
    this.collection = {};
    this.unitCollection = {};
    this.rules = { number: 0 };
  }

  public addCollection(u: Unit, date?: Date) {
    if (this.unitCollection[u.number]) {
      return undefined;
    }

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
    this.unitCollection[u.number] = u;
    this.latest = u;
  }

  public saveRule(rule: object) {
    this.rules = rule;
  }

  public getLast() {
    return this.latest;
  }

  public getMonthlyPrice(year?: number, month?: number /* 0-11 */) {
    return this.calculatePrice(this.getUnit(year, month));
  }

  public getTotalPrice() {
    const list = this.list();

    return this.calculatePrice(list[list.length - 1].number - list[0].number);
  }

  public list() {
    return Object.values(this.unitCollection);
  }

  public length() {
    return this.list().length;
  }

  public getUnit(year?: number, month?: number) {
    const currentDate = new Date();
    const currentMonth = month || currentDate.getUTCMonth();
    const currentYear = year || currentDate.getUTCFullYear();

    if (!this.collection || !this.collection[currentYear] || !this.collection[currentYear][currentMonth]) {
      return 0;
    }

    const collectData = this.collection[currentYear][currentMonth];
    collectData.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf());

    return collectData[0].number - collectData[collectData.length - 1].number;
  }

  public abstract calculatePrice(unit: number): number;
}
