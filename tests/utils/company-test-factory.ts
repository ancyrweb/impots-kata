import { Company } from "../../src/domain/companies/company.js";
import { Year } from "../../src/domain/shared/year.js";

export class CompanyTestFactory {
  static create({
    id = "company-id",
    ownerId = "owner-id",
    yearOfCreation = new Year(2025),
  }: {
    id?: string;
    ownerId?: string;
    yearOfCreation?: Year;
  } = {}): Company {
    return new Company({
      id,
      ownerId,
      yearOfCreation,
    });
  }
}
