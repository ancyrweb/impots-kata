import { Payments } from "./payments.js";
import {
  DeductionDTO,
  DeductionFactory,
} from "./deductions/deduction-factory.js";
import { Tax } from "./tax.js";

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

type Report = {
  taxableIncome: number;
  toPay: number;
  paid: number;
};

export class TaxCalculator {
  private rates = [
    new Rate(50_000, 0.3),
    new Rate(30_000, 0.25),
    new Rate(20_000, 0.18),
    new Rate(10_000, 0.1),
  ];

  private readonly payments: Payments;
  private readonly deductionFactory = new DeductionFactory();

  constructor({ payments }: { payments: Payments }) {
    this.payments = payments;
  }

  calculate({
    userId,
    paySlip,
    deductions,
  }: {
    userId: string;
    paySlip: number;
    deductions?: DeductionDTO[];
  }): Report {
    const incomeObj = new Income(paySlip);
    const tax = new Tax(0);

    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      if (rate.isApplicable(incomeObj)) {
        rate.apply(incomeObj, tax);
      }
    }

    const upfrontPayments = this.payments.sumUpfrontPayments(userId);
    tax.deduceUpfrontPayments(upfrontPayments);

    if (deductions) {
      for (const deductionDto of deductions) {
        const deduction = this.deductionFactory.create(deductionDto);
        deduction.applyTo(tax);
      }
    }

    return {
      taxableIncome: Math.max(0, paySlip - 10_000),
      toPay: tax.asNumber(),
      paid: upfrontPayments.asNumber(),
    };
  }
}
