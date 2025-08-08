import { Payments } from "../../domain/payments.js";
import { SumOfUpfrontPayments } from "../../domain/sum-of-upfront-payments.js";

type Mapping = Record<string, number>;

export class InMemoryPayments implements Payments {
  constructor(private readonly mapping: Mapping = {}) {}

  map(userId: string, paySlip: number) {
    this.mapping[userId] = paySlip;
  }

  sumUpfrontPayments(userId: string) {
    if (userId in this.mapping) {
      return new SumOfUpfrontPayments(this.mapping[userId]);
    }

    return new SumOfUpfrontPayments(0);
  }
}
