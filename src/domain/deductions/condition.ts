import { Income } from "../tax/income.js";
import { Tax } from "../tax/tax.js";

export type ConditionSatisfactionProps = {
  income: Income;
  tax: Tax;
};

export interface Condition {
  isSatisfied(props: ConditionSatisfactionProps): boolean;
}

export class NoCondition implements Condition {
  isSatisfied(props: ConditionSatisfactionProps): boolean {
    return true;
  }
}

export class FixedThresholdCondition implements Condition {
  constructor(public readonly value: number) {}

  isSatisfied(props: ConditionSatisfactionProps): boolean {
    return props.tax.isHigherOrEqualThan(this.value);
  }
}
