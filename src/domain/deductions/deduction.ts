import { Tax } from "../tax.js";

export interface Deduction {
  applyTo(tax: Tax): void;
}
