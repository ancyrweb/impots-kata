export class TaxableIncome {
  constructor(private readonly slip: number) {}

  asNumber() {
    return Math.max(0, this.slip - 10_000);
  }
}
