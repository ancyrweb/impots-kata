import { Tax } from "../tax/tax.js";

export interface Deduction {
  applyTo(tax: Tax): void;
  isHigherThan(other: Deduction): boolean;
}
