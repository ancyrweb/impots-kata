export class UpfrontPayments {
  constructor(private readonly value: number) {}

  asNumber(): number {
    return this.value;
  }
}
