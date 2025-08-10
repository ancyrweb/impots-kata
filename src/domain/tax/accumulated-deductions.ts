export class AccumulatedDeductions {
  private static CAP = 1_271;

  private deductions: number;

  constructor() {
    this.deductions = 0;
  }

  add(amount: number): void {
    if (amount < 0) {
      throw new Error("Deduction amount cannot be negative");
    }

    this.deductions += amount;
  }

  totalApplicable() {
    return Math.min(AccumulatedDeductions.CAP, this.deductions);
  }
}
