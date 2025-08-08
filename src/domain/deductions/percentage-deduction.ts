import { Deduction } from "./deduction.js";
import { Percentage } from "../percentage.js";
import { Tax } from "../tax.js";

export class PercentageDeduction implements Deduction {
  constructor(public value: Percentage) {}

  applyTo(tax: Tax): void {
    tax.prorate(this.value);
  }
}