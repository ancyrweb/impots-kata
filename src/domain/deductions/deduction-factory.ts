import { Percentage } from "../percentage.js";
import { FixedDeduction } from "./fixed-deduction.js";
import { PercentageDeduction } from "./percentage-deduction.js";
import { Deductions } from "./deductions.js";

export type DeductionDTO = {
  type: "fixed" | "percentage";
  value: number;
};

export class DeductionFactory {
  createAll(allDtos: DeductionDTO[]): Deductions {
    const percentage: PercentageDeduction[] = [];
    const fixed: FixedDeduction[] = [];

    for (const dto of allDtos) {
      switch (dto.type) {
        case "fixed":
          fixed.push(new FixedDeduction(dto.value));
          break;
        case "percentage":
          percentage.push(
            new PercentageDeduction(Percentage.fromDecimal(dto.value)),
          );
          break;
        default:
          throw new Error(`Unknown deduction type: ${dto.type}`);
      }
    }

    return new Deductions(percentage, fixed);
  }
}
