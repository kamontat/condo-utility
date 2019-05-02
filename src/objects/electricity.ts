import { Utilities } from './abstacts';

export class Electricity extends Utilities {
  constructor() {
    super();
  }

  public calculatePrice(unit: number) {
    return unit * 4; // TODO: Implement this method
  }
}
