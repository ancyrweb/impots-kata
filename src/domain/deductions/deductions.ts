import { PercentageDeduction } from "./percentage-deduction.js";
import { FixedDeduction } from "./fixed-deduction.js";
import { Tax } from "../tax/tax.js";

export class Deductions {
  constructor(
    private readonly percentage: PercentageDeduction[],
    private readonly fixed: FixedDeduction[],
  ) {}

  applyTo(tax: Tax): void {
    this.applyPercentages(tax);
    this.applyFixed(tax);
  }

  private applyFixed(tax: Tax) {
    for (const deduction of this.fixed) {
      deduction.applyTo(tax);
    }
  }

  private applyPercentages(tax: Tax) {
    if (this.percentage.length === 0) {
      return;
    }

    // Select the highest percentage deduction
    const deductionToApply = this.percentage.reduce((prev, curr) =>
      prev.isHigherThan(curr) ? prev : curr,
    );

    deductionToApply.applyTo(tax);
  }
}
