import { Percentage } from "../percentage.js";
import { FixedDeduction } from "./fixed-deduction.js";
import { PercentageDeduction } from "./percentage-deduction.js";
import { Deductions } from "./deductions.js";
import { FixedThresholdCondition, NoCondition } from "./condition.js";
import { ConditionalDeduction } from "./conditional-deduction.js";

type ConditionDTO = {
  type: "tax-threshold";
  value: number;
};

export type DeductionDTO = {
  type: "fixed" | "percentage";
  value: number;
  condition?: ConditionDTO;
};

export class DeductionFactory {
  createAll(allDtos: DeductionDTO[]): Deductions {
    const percentage: ConditionalDeduction[] = [];
    const fixed: ConditionalDeduction[] = [];

    for (const dto of allDtos) {
      switch (dto.type) {
        case "fixed":
          fixed.push(
            new ConditionalDeduction(
              new FixedDeduction(dto.value),
              this.createCondition(dto.condition),
            ),
          );
          break;
        case "percentage":
          percentage.push(
            new ConditionalDeduction(
              new PercentageDeduction(new Percentage(dto.value)),
              this.createCondition(dto.condition),
            ),
          );
          break;
        default:
          throw new Error(`Unknown deduction type: ${dto.type}`);
      }
    }

    return new Deductions(fixed, percentage);
  }

  private createCondition(condition?: ConditionDTO) {
    if (!condition) {
      return new NoCondition();
    }

    switch (condition.type) {
      case "tax-threshold":
        return new FixedThresholdCondition(condition.value);
      default:
        throw new Error(`Unknown condition type: ${condition.type}`);
    }
  }
}
