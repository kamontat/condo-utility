import { Utilities } from './abstacts';

export class Water extends Utilities {
  public calculatePrice(unit: number) {
    return unit * parseInt(this.rules.number.toString(), 10);
  }
}
