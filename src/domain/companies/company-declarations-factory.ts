import { CompanyDeclaration } from "./company-declaration.js";
import { Allowance } from "./allowance.js";

export type CompanyDeclarationDTO = {
  companyId: string;
  type: "services" | "commercial";
  revenues: number;
};

export class CompanyDeclarationsFactory {
  createAll(dtos?: CompanyDeclarationDTO[]): CompanyDeclaration[] {
    if (!dtos) {
      return [];
    }

    return dtos.map((dto) => {
      switch (dto.type) {
        case "services":
          return new CompanyDeclaration(dto.companyId, Allowance.services(), dto.revenues);
        case "commercial":
          return new CompanyDeclaration(dto.companyId, Allowance.commercial(), dto.revenues);
        default:
          throw new Error(`Unknown company revenue type: ${dto.type}`);
      }
    });
  }
}
