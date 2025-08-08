import { Payments } from "./payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deductions/deduction-factory.js";
import { Tax } from "./tax/tax.js";
import { Income } from "./tax/income.js";
import { Rate } from "./tax/rate.js";
import { TaxableIncome } from "./tax/taxable-income.js";

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

    // Handle upfront payments
    const upfrontPayments = this.payments.sumUpfrontPayments(userId);
    tax.deduceUpfrontPayments(upfrontPayments);

    // Handle deductions
    const allDeductions = this.deductionFactory.createAll(deductions ?? []);
    allDeductions.applyTo(tax);

    return {
      taxableIncome: new TaxableIncome(paySlip).asNumber(),
      toPay: tax.asNumber(),
      paid: upfrontPayments.asNumber(),
    };
  }
}
