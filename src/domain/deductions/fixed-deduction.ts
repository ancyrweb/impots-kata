import { Deduction } from "./deduction.js";
import { Tax } from "../tax/tax.js";

export class FixedDeduction implements Deduction {
  constructor(public value: number) {}

  applyTo(tax: Tax): void {
    tax.deduce(this.value);
  }
}
