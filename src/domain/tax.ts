import { SumOfUpfrontPayments } from "./sum-of-upfront-payments.js";
import { Percentage } from "./percentage.js";

export class Tax {
  constructor(private amount: number) {}

  add(amount: number) {
    this.amount += amount;
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

  prorate(value: Percentage) {
    this.amount = value.applyTo(this.amount);
  }
}
