import { Percentage } from "../shared/percentage.js";
import { CompanyRevenues } from "./company-revenues.js";
import { Company } from "./company.js";
import { Year } from "../shared/year.js";
import { Allowance } from "./allowance.js";

export class FixedAllowance implements Allowance {
  constructor(private readonly allowance: Percentage) {}

  applyTo(revenues: CompanyRevenues, company: Company, currentYear: Year) {
    if (company.isFirstYear(currentYear)) {
      return 0;
    }

    return this.allowance.complement().applyTo(revenues.asNumber());
  }
}
