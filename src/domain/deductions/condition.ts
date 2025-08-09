import { Tax } from "../tax/tax.js";
import { Income } from "../tax/income.js";

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

export class TaxThresholdCondition implements Condition {
  constructor(public readonly value: number) {}

  isSatisfied({ tax }: ConditionSatisfactionProps): boolean {
    return tax.isHigherOrEqualThan(this.value);
  }
}

export class TaxableIncomeThresholdCondition implements Condition {
  constructor(public readonly value: number) {}

  isSatisfied({ income }: ConditionSatisfactionProps): boolean {
    return income.taxablePart() <= this.value;
  }
}
