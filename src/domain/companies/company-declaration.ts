import { Allowance } from "./allowance.js";
import { Company } from "./company.js";
import { CompanyRevenues } from "./company-revenues.js";

export class CompanyDeclaration {
  constructor(
    private readonly company: Company,
    private readonly allowance: Allowance,
    private readonly revenues: CompanyRevenues,
  ) {}

  revenuesAfterAllowance() {
    return this.allowance.applyTo(this.revenues);
  }

  getCompany() {
    return this.company;
  }
}
