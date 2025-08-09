import { Deduction } from "./deduction.js";
import { Percentage } from "../percentage.js";
import { Tax } from "../tax/tax.js";

export class PercentageDeduction implements Deduction {
  constructor(public value: Percentage) {}

  applyTo(tax: Tax): void {
    tax.prorate(this.value);
  }

  isHigherThan(curr: Deduction): boolean {
    if (!(curr instanceof PercentageDeduction)) {
      throw new Error("Cannot compare PercentageDeduction with non-PercentageDeduction");
    }

    return this.value.isHigherThan(curr.value);
  }
}
