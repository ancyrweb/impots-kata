export class WorkingIncome {
  constructor(private amount: number) {}

  asNumber() {
    return this.amount;
  }

  deduce(amount: number) {
    this.amount -= amount;
  }

  greaterThan(threshold: number): boolean {
    return this.amount > threshold;
  }
}
