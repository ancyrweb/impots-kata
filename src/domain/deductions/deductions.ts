import { ConditionSatisfactionProps } from "./condition.js";
import { ConditionalDeduction } from "./conditional-deduction.js";
import { HighestPercentageDeduction } from "./highest-percentage-deduction.js";

export class Deductions {
  private percentage: HighestPercentageDeduction;

  constructor(
    private readonly allFixed: ConditionalDeduction[],
    allPercentages: ConditionalDeduction[],
  ) {
    this.percentage = HighestPercentageDeduction.fromPercentages(allPercentages);
  }

  applyTo(props: ConditionSatisfactionProps): void {
    this.applyPercentages(props);
    this.applyFixed(props);
  }

  private applyFixed(props: ConditionSatisfactionProps) {
    for (const deduction of this.allFixed) {
      if (deduction.isApplicable(props)) {
        deduction.applyTo(props.tax);
      }
    }
  }

  private applyPercentages(props: ConditionSatisfactionProps) {
    this.percentage.applyTo(props.tax);
  }
}
