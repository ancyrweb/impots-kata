import { UpfrontPayments } from "./upfront-payments.js";

export interface Payments {
  sumUpfrontPayments(userId: string): UpfrontPayments;
}
