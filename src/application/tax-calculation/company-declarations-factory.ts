import { CompanyDeclaration } from "../../domain/companies/company-declaration.js";
import { Allowance } from "../../domain/companies/allowance.js";
import { Companies } from "../../domain/companies/companies.js";
import { CompanyRevenues } from "../../domain/companies/company-revenues.js";

export type CompanyDeclarationDTO = {
  companyId: string;
  type: "services" | "commercial";
  revenues: number;
};

export class CompanyDeclarationsFactory {
  constructor(private readonly companies: Companies) {}

  createAll(userId: string, dtos?: CompanyDeclarationDTO[]): CompanyDeclaration[] {
    if (!dtos) {
      return [];
    }

    const userCompanies = this.companies.findByUserId(userId);

    return dtos.map((dto) => {
      return new CompanyDeclaration(
        userCompanies[0],
        this.detectAllowance(dto),
        new CompanyRevenues(dto.revenues),
      );
    });
  }

  private detectAllowance(dto: CompanyDeclarationDTO) {
    switch (dto.type) {
      case "services":
        return Allowance.services();
      case "commercial":
        return Allowance.commercial();
      default:
        throw new Error(`Unknown company revenue type: ${dto.type}`);
    }
  }
}
