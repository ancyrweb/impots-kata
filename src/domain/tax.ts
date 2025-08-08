import { UpfrontPayments } from "./upfront-payments.js";
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

  applyUpfrontPayment(upfrontPayment: UpfrontPayments) {
    this.amount -= upfrontPayment.asNumber();
  }

  prorate(value: Percentage) {
    this.amount = value.applyTo(this.amount);
  }
}
