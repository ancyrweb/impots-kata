import { Allowance } from "./allowance.js";

export class CompanyDeclaration {
  constructor(
    private readonly companyId: string,
    private readonly allowance: Allowance,
    private readonly revenues: number,
  ) {}

  revenuesAfterAllowance() {
    return this.allowance.applyTo(this.revenues);
  }
}
