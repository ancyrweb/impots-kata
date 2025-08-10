import { Companies } from "../../domain/companies/companies.js";
import { Company } from "../../domain/companies/company.js";

export class InMemoryCompanies implements Companies {
  constructor(private readonly companies: Company[] = []) {}

  findByUserId(userId: string): Company[] {
    return this.companies.filter((company) => company.belongsTo(userId));
  }
}
