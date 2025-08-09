import { WorkingIncome } from "./working-income.js";

export class Income {
  constructor(private readonly amount: number) {}

  taxablePart() {
    const deduction = 10_000;
    return Math.max(0, this.amount - deduction);
  }

  toWorkingIncome() {
    return new WorkingIncome(this.amount);
  }
}
