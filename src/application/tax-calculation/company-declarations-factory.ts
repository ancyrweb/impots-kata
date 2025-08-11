import { CompanyDeclaration } from "../../domain/companies/company-declaration.js";
import { Companies } from "../../domain/companies/companies.js";
import { CompanyRevenues } from "../../domain/companies/company-revenues.js";
import { AllowanceConfiguration } from "../../domain/companies/allowances/allowance-configuration.js";

export type CompanyDeclarationDTO = {
  companyId: string;
  type: "services" | "commercial";
  revenues: number;
};

export class CompanyDeclarationsFactory {
  private readonly allowanceConfiguration = new AllowanceConfiguration();

  constructor(private readonly companies: Companies) {}

  createAll(userId: string, dtos?: CompanyDeclarationDTO[]): CompanyDeclaration[] {
    if (!dtos) {
      return [];
    }

    const userCompanies = this.companies.findByUserId(userId);

    return dtos.map((dto) => {
      const company = userCompanies.find((c) => c.getId() === dto.companyId);
      if (!company) {
        throw new Error(`Company with ID ${dto.companyId} not found for user ${userId}`);
      }

      return new CompanyDeclaration(
        company,
        this.allowanceConfiguration.get(company.getCity(), dto.type),
        new CompanyRevenues(dto.revenues),
      );
    });
  }
}
