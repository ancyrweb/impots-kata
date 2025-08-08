import { Deduction } from "./deduction.js";
import { Percentage } from "../percentage.js";
import { FixedDeduction } from "./fixed-deduction.js";
import { PercentageDeduction } from "./percentage-deduction.js";

export type DeductionDTO = {
  type: "fixed" | "percentage";
  value: number;
};

export class DeductionFactory {
  create(dto: DeductionDTO): Deduction {
    switch (dto.type) {
      case "fixed":
        return new FixedDeduction(dto.value);
      case "percentage":
        return new PercentageDeduction(Percentage.fromDecimal(dto.value));
      default:
        throw new Error(`Unknown deduction type: ${dto.type}`);
    }
  }
}
