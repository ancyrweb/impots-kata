import { Percentage } from "../shared/percentage.js";
import { CompanyRevenues } from "./company-revenues.js";

export class Allowance {
  constructor(private readonly allowance: Percentage) {}

  applyTo(revenues: CompanyRevenues) {
    return this.allowance.complement().applyTo(revenues.asNumber());
  }
}
