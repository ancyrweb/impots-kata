import { Deduction } from "./deduction.js";
import { Tax } from "../tax/tax.js";
import { AccumulatedDeductions } from "../tax/accumulated-deductions.js";

export class FixedDeduction implements Deduction {
  constructor(private readonly value: number) {}

  applyTo(_tax: Tax, accumulatedDeductions: AccumulatedDeductions): void {
    accumulatedDeductions.add(this.value);
  }

  isHigherThan(other: Deduction): boolean {
    if (!(other instanceof FixedDeduction)) {
      throw new Error("Cannot compare FixedDeduction with non-FixedDeduction");
    }

    return this.value > other.value;
  }
}
