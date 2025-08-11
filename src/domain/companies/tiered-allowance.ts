import { Percentage } from "../shared/percentage.js";
import { CompanyRevenues } from "./company-revenues.js";
import { Company } from "./company.js";
import { Year } from "../shared/year.js";
import { Allowance } from "./allowance.js";

export class TieredAllowance implements Allowance {
  constructor(private readonly allowances: Percentage[]) {}

  applyTo(revenues: CompanyRevenues, company: Company, currentYear: Year) {
    const differenceInYears = Math.max(0, currentYear.difference(company.getYearOfCreation()) - 1);
    const allowance =
      differenceInYears >= this.allowances.length
        ? this.allowances[this.allowances.length - 1]
        : this.allowances[differenceInYears];

    return allowance.complement().applyTo(revenues.asNumber());
  }
}
