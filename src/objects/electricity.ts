import { Utilities } from './abstacts';

export class Electricity extends Utilities {
  public calculatePrice(unit: number) {
    const rule = unit > 150 ? this.rules.high : this.rules.low;
    if (!rule) {
      return 0;
    }
    const service = rule.service;
    const condition = {
      ...rule,
    };
    delete condition.service;

    let price = 0;
    let previous = 0;
    for (const key in condition) {
      const number = parseInt(key, 10);
      const rate = condition[key];

      if (unit <= number) {
        price += (unit - previous) * rate;
        break; // terminate condition
      } else {
        price += (number - previous) * rate;
        previous = number;
      }
    }

    const base = price + service;
    const ft = unit * this.rules.ft;
    const final = base + ft;
    const vat = (final * 7) / 100; // 7%
    return (final + vat).toFixed(2);
  }
}
