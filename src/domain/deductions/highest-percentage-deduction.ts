import { Deduction } from "./deduction.js";
import { ConditionalDeduction } from "./conditional-deduction.js";
import { NoDeduction } from "./no-deduction.js";
import { Tax } from "../tax/tax.js";
import { AccumulatedDeductions } from "../tax/accumulated-deductions.js";

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

  applyTo(tax: Tax, accumulatedDeductions: AccumulatedDeductions): void {
    this.applicable.applyTo(tax, accumulatedDeductions);
  }

  isHigherThan(other: Deduction): boolean {
    return this.applicable.isHigherThan(other);
  }
}
