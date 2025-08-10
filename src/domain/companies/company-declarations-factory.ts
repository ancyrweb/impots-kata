import { CompanyDeclaration } from "./company-declaration.js";
import { Allowance } from "./allowance.js";
import { Companies } from "./companies.js";

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
      return new CompanyDeclaration(userCompanies[0], this.detectAllowance(dto), dto.revenues);
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
