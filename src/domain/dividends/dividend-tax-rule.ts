import { Dividend } from "./dividend.js";
import { Year } from "../shared/year.js";
import { Tax } from "../tax/tax.js";

export interface DividendTaxRule {
  computeTax(dividend: Dividend, currentYear: Year): Tax;
}
