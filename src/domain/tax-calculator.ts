import { Payments } from "./payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deductions/deduction-factory.js";
import { Tax } from "./tax/tax.js";
import { Rate } from "./tax/rate.js";
import { Income } from "./tax/income.js";
import { AccumulatedDeductions } from "./tax/accumulated-deductions.js";

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
    const income = new Income(paySlip);
    const workingIncome = income.toWorkingIncome();
    const tax = new Tax(0);

    // Apply the various rates
    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      if (rate.isApplicable(workingIncome)) {
        rate.apply(workingIncome, tax);
      }
    }

    // Handle upfront payments
    const upfrontPayments = this.payments.sumUpfrontPayments(userId);
    tax.deduceUpfrontPayments(upfrontPayments);

    // Handle deductions
    const accumulatedDeductions = new AccumulatedDeductions();
    const allDeductions = this.deductionFactory.createAll(deductions ?? []);
    allDeductions.applyTo({
      income,
      tax,
      accumulatedDeductions,
    });

    tax.deduce(accumulatedDeductions.totalApplicable());

    return {
      taxableIncome: income.taxablePart(),
      toPay: tax.asNumber(),
      paid: upfrontPayments.asNumber(),
    };
  }
}
