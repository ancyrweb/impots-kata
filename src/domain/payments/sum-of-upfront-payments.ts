export class SumOfUpfrontPayments {
  constructor(private readonly value: number) {}

  asNumber(): number {
    return this.value;
  }
}
