import { SumOfUpfrontPayments } from "../payments/sum-of-upfront-payments.js";
import { Percentage } from "../shared/percentage.js";

export class Tax {
  constructor(private amount: number) {}

  add(amount: number) {
    this.amount += amount;
  }

  addTax(tax: Tax) {
    this.amount += tax.asNumber();
  }

  deduce(amount: number) {
    this.amount -= amount;
  }

  asNumber() {
    return this.amount;
  }

  deduceUpfrontPayments(upfrontPayment: SumOfUpfrontPayments) {
    this.amount -= upfrontPayment.asNumber();
  }

  prorated(value: Percentage) {
    return value.applyTo(this.amount);
  }

  isHigherOrEqualThan(value: number) {
    return this.amount >= value;
  }
}
