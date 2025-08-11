import { CompanyRevenues } from "./company-revenues.js";
import { Company } from "./company.js";
import { Year } from "../shared/year.js";

export interface Allowance {
  applyTo(revenues: CompanyRevenues, company: Company, currentYear: Year): number;
}
