import { Income } from "./income.js";

import { CompanyDeclaration } from "../companies/company-declaration.js";

export class IncomeBuilder {
  private amount: number = 0;

  addPaySlip(paySlip: number): IncomeBuilder {
    this.amount += paySlip;
    return this;
  }

  addCompanyDeclarations(revenues: CompanyDeclaration[]): IncomeBuilder {
    revenues.forEach((revenue) => {
      this.amount += revenue.revenuesAfterAllowance();
    });

    return this;
  }

  build() {
    return new Income(this.amount);
  }
}
