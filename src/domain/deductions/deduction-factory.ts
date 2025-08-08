import { Tax } from "../tax.js";
import { Deduction } from "./deduction.js";
import { Percentage } from "../percentage.js";

export type DeductionDTO = {
  type: "fixed" | "percentage";
  value: number;
};

class FixedDeduction implements Deduction {
  constructor(public value: number) {}

  applyTo(tax: Tax): void {
    tax.deduce(this.value);
  }
}

class PercentageDeduction implements Deduction {
  constructor(public value: Percentage) {}

  applyTo(tax: Tax): void {
    tax.prorate(this.value);
  }
}

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
