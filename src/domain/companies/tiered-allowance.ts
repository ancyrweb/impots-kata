import { Percentage } from "../shared/percentage.js";
import { CompanyRevenues } from "./company-revenues.js";
import { Company } from "./company.js";
import { Year } from "../shared/year.js";
import { Allowance } from "./allowance.js";

export class TieredAllowance implements Allowance {
  constructor(private readonly allowances: Percentage[]) {}

  applyTo(revenues: CompanyRevenues, company: Company, currentYear: Year) {
    const delta = Math.max(0, currentYear.difference(company.getYearOfCreation()) - 1);

    if (delta >= this.allowances.length) {
      return this.allowances[this.allowances.length - 1].complement().applyTo(revenues.asNumber());
    }

    return this.allowances[delta].complement().applyTo(revenues.asNumber());
  }
}
