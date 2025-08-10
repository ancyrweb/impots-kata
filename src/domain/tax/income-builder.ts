import { Income } from "./income.js";

import { CompanyDeclaration } from "../companies/company-declaration.js";
import { Year } from "../shared/year.js";

export class IncomeBuilder {
  private amount: number = 0;

  constructor(private readonly currentYear: Year) {}

  addPaySlip(paySlip: number): IncomeBuilder {
    this.amount += paySlip;
    return this;
  }

  addCompanyDeclarations(companyDeclarations: CompanyDeclaration[]): IncomeBuilder {
    companyDeclarations.forEach((declaration) => {
      const company = declaration.getCompany();
      if (!company.isDeclarationLegal(this.currentYear)) {
        throw new Error(
          `Company ${company.getId()} is not allowed to declare its revenues for year ${this.currentYear}`,
        );
      }

      if (company.isFirstYear(this.currentYear)) {
        return;
      }

      this.amount += declaration.revenuesAfterAllowance();
    });

    return this;
  }

  build() {
    return new Income(this.amount);
  }
}
