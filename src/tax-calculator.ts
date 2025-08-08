class Rate {
  constructor(
    public threshold: number,
    public rate: number,
  ) {}

  apply(income: Income, tax: Tax) {
    const applicableRange = income.asNumber() - this.threshold;
    tax.add(applicableRange * this.rate);
    income.deduce(applicableRange);
  }

  isApplicable(income: Income): boolean {
    return income.greaterThan(this.threshold);
  }
}

class Tax {
  constructor(private amount: number) {}

  add(amount: number) {
    this.amount += amount;
  }

  asNumber() {
    return this.amount;
  }
}

class Income {
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

export class TaxCalculator {
  private rates = [
    new Rate(50_000, 0.3),
    new Rate(30_000, 0.25),
    new Rate(20_000, 0.18),
    new Rate(10_000, 0.1),
  ];

  calculate(income: number) {
    const incomeObj = new Income(income);
    const tax = new Tax(0);

    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      if (rate.isApplicable(incomeObj)) {
        rate.apply(incomeObj, tax);
      }
    }

    return tax.asNumber();
  }
}
