import { Deduction } from "./deduction.js";
import { ConditionalDeduction } from "./conditional-deduction.js";
import { NoDeduction } from "./no-deduction.js";
import { Tax } from "../tax/tax.js";

export class HighestPercentageDeduction implements Deduction {
  static fromPercentages(deductions: ConditionalDeduction[]): HighestPercentageDeduction {
    return new HighestPercentageDeduction(
      deductions.reduce(
        (prev: Deduction, curr: Deduction) => (prev.isHigherThan(curr) ? prev : curr),
        new NoDeduction(),
      ),
    );
  }

  constructor(private applicable: Deduction) {}

  applyTo(tax: Tax): void {
    this.applicable.applyTo(tax);
  }

  isHigherThan(other: Deduction): boolean {
    return this.applicable.isHigherThan(other);
  }
}
