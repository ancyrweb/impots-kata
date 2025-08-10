import { Income } from "./income.js";
import { EntrepreneurRevenue } from "../entrepreneur-revenues/entrepreneur-revenues-factory.js";

export class IncomeBuilder {
  private amount: number = 0;

  addPaySlip(paySlip: number): IncomeBuilder {
    this.amount += paySlip;
    return this;
  }

  addEntrepreneurRevenues(revenues: EntrepreneurRevenue[]): IncomeBuilder {
    revenues.forEach((revenue) => {
      this.amount += revenue.applicableRevenues();
    });

    return this;
  }

  build() {
    return new Income(this.amount);
  }
}
