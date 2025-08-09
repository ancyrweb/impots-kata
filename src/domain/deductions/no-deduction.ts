import { Deduction } from "./deduction.js";
import { Tax } from "../tax/tax.js";

export class NoDeduction implements Deduction {
  applyTo(tax: Tax) {
    // nothing to do
  }

  isHigherThan(other: Deduction): boolean {
    return false;
  }
}
