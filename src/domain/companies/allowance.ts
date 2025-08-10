import { Percentage } from "../percentage.js";

export class Allowance {
  static services() {
    return new Allowance(Percentage.fromDecimal(0.34).complement());
  }

  static commercial() {
    return new Allowance(Percentage.fromDecimal(0.71).complement());
  }

  constructor(private readonly allowance: Percentage) {}

  applyTo(revenues: number) {
    return this.allowance.applyTo(revenues);
  }
}
