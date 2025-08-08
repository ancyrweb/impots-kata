import { SumOfUpfrontPayments } from "./sum-of-upfront-payments.js";

export interface Payments {
  sumUpfrontPayments(userId: string): SumOfUpfrontPayments;
}
