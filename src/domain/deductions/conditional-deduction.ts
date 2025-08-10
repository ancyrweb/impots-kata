import { Deduction } from "./deduction.js";
import { Condition, ConditionSatisfactionProps } from "./condition.js";
import { Tax } from "../tax/tax.js";
import { AccumulatedDeductions } from "../tax/accumulated-deductions.js";

export class ConditionalDeduction implements Deduction {
  constructor(
    public readonly deduction: Deduction,
    public readonly condition: Condition,
  ) {}

  isApplicable(props: ConditionSatisfactionProps): boolean {
    return this.condition.isSatisfied(props);
  }

  applyTo(tax: Tax, accumulatedDeductions: AccumulatedDeductions): void {
    this.deduction.applyTo(tax, accumulatedDeductions);
  }

  isHigherThan(other: Deduction): boolean {
    return other.isHigherThan(this.deduction);
  }
}
