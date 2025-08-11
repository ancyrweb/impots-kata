import { Dividend } from "../../domain/dividends/dividend.js";
import { Companies } from "../../domain/companies/companies.js";

export type DividendDTO = {
  companyId: string;
  amount: number;
};

export class DividendFactory {
  constructor(private readonly companies: Companies) {}

  createAll(userId: string, dtos: DividendDTO[]): Dividend[] {
    const companies = this.companies.findByUserId(userId);

    return dtos.map((dto) => {
      const company = companies.find((c) => c.getId() === dto.companyId);
      if (!company) {
        throw new Error(`Company with ID ${dto.companyId} not found for user ${userId}`);
      }

      return new Dividend(dto.amount, company);
    });
  }
}
