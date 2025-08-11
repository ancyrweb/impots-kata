import { Company } from "../companies/company.js";

export class Dividend {
  constructor(
    private readonly amount: number,
    private readonly company: Company,
  ) {}

  asNumber() {
    return this.amount;
  }

  getCompany() {
    return this.company;
  }
}
