import { Clock } from "../../domain/shared/clock.js";
import { Year } from "../../domain/shared/year.js";

export class InMemoryClock implements Clock {
  constructor(private value = new Year(2025)) {}

  currentYear(): Year {
    return this.value;
  }

  changeYear(year: Year) {
    this.value = year;
  }
}
