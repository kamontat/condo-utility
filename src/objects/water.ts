import { Utilities } from './abstacts';

export class Water extends Utilities {
  constructor() {
    super();
  }

  public calculatePrice(unit: number) {
    return unit * parseInt(this.rules.toString(), 10);
  }
}
