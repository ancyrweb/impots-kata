export class CompanyRevenues {
  constructor(private readonly amount: number) {}

  asNumber(): number {
    return this.amount;
  }
}
