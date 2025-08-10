export class Percentage {
  static fromDecimal(decimal: number): Percentage {
    if (decimal < 0 || decimal > 1) {
      throw new Error("Decimal must be between 0 and 1");
    }

    return new Percentage(decimal);
  }

  constructor(public readonly value: number) {}

  applyTo(amount: number) {
    return Math.round(amount * this.value);
  }

  complement() {
    return new Percentage(1 - this.value);
  }

  isHigherThan(value: Percentage) {
    return this.value > value.value;
  }
}
