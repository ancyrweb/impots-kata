import { Company } from "./company.js";
import { CompanyRevenues } from "./company-revenues.js";
import { Year } from "../shared/year.js";
import { Allowance } from "./allowances/allowance.js";

export class CompanyDeclaration {
  constructor(
    private readonly company: Company,
    private readonly allowance: Allowance,
    private readonly revenues: CompanyRevenues,
  ) {}

  revenuesAfterAllowance(currentYear: Year) {
    return this.allowance.revenuesAfterAllowance(this.revenues, this.company, currentYear);
  }

  getCompany() {
    return this.company;
  }
}
