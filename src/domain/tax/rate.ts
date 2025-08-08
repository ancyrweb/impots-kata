import { Income } from "./income.js";
import { Tax } from "./tax.js";

export class Rate {
  constructor(
    public threshold: number,
    public rate: number,
  ) {}

  apply(income: Income, tax: Tax) {
    const applicableRange = income.asNumber() - this.threshold;
    tax.add(applicableRange * this.rate);
    income.deduce(applicableRange);
  }

  isApplicable(income: Income): boolean {
    return income.greaterThan(this.threshold);
  }
}