import { Tax } from "../tax/tax.js";

export class Dividend {
  private static DIVIDEND_RATE = 0.3;

  constructor(private readonly amount: number) {}

  applyTo(tax: Tax) {
    tax.add(this.amount * Dividend.DIVIDEND_RATE);
  }
}
