import { Percentage } from "../../shared/percentage.js";
import { CompanyRevenues } from "../company-revenues.js";
import { Allowance } from "./allowance.js";

export class FixedAllowance implements Allowance {
  constructor(private readonly allowance: Percentage) {}

  revenuesAfterAllowance(revenues: CompanyRevenues) {
    return this.allowance.complement().applyTo(revenues.asNumber());
  }
}
