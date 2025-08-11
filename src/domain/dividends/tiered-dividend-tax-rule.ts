import { Percentage } from "../shared/percentage.js";
import { Tax } from "../tax/tax.js";
import { Dividend } from "./dividend.js";
import { Year } from "../shared/year.js";

export class TieredDividendTaxRule {
  constructor(private readonly rates: Percentage[]) {}

  computeTax(dividend: Dividend, currentYear: Year): Tax {
    const company = dividend.getCompany();
    const differenceInYears = Math.max(0, currentYear.difference(company.getYearOfCreation()) - 1);
    const allowance =
      differenceInYears >= this.rates.length
        ? this.rates[this.rates.length - 1]
        : this.rates[differenceInYears];

    return new Tax(allowance.applyTo(dividend.asNumber()));
  }
}
