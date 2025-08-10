import { Allowance } from "./allowance.js";
import { Company } from "./company.js";

export class CompanyDeclaration {
  constructor(
    private readonly company: Company,
    private readonly allowance: Allowance,
    private readonly revenues: number,
  ) {}

  revenuesAfterAllowance() {
    return this.allowance.applyTo(this.revenues);
  }

  getCompany() {
    return this.company;
  }
}
