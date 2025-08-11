import { Percentage } from "../shared/percentage.js";
import { Tax } from "../tax/tax.js";
import { Dividend } from "./dividend.js";
import { Year } from "../shared/year.js";
import { DividendTaxRule } from "./dividend-tax-rule.js";

export class FixedDividendTaxRule implements DividendTaxRule {
  constructor(private readonly rate: Percentage) {}

  computeTax(dividend: Dividend, currentYear: Year): Tax {
    return new Tax(this.rate.applyTo(dividend.asNumber()));
  }
}
