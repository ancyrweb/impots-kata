import { Tax } from "../tax/tax.js";
import { AccumulatedDeductions } from "../tax/accumulated-deductions.js";

export interface Deduction {
  applyTo(tax: Tax, accumulation: AccumulatedDeductions): void;
  isHigherThan(other: Deduction): boolean;
}
