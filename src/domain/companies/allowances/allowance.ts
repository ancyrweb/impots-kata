import { CompanyRevenues } from "../company-revenues.js";
import { Company } from "../company.js";
import { Year } from "../../shared/year.js";

export interface Allowance {
  revenuesAfterAllowance(revenues: CompanyRevenues, company: Company, currentYear: Year): number;
}
