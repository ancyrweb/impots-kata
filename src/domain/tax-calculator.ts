import { Payments } from "./payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deductions/deduction-factory.js";
import { Tax } from "./tax/tax.js";
import { Rate } from "./tax/rate.js";
import { AccumulatedDeductions } from "./tax/accumulated-deductions.js";
import { IncomeBuilder } from "./tax/income-builder.js";
import {
  CompanyDeclarationDTO,
  CompanyDeclarationsFactory,
} from "./companies/company-declarations-factory.js";
import { Income } from "./tax/income.js";

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
  private readonly entrepreneurRevenuesFactory = new CompanyDeclarationsFactory();

  constructor({ payments }: { payments: Payments }) {
    this.payments = payments;
  }

  calculate({
    userId,
    paySlip,
    deductions,
    entrepreneurRevenues,
  }: {
    userId: string;
    paySlip: number;
    deductions?: DeductionDTO[];
    entrepreneurRevenues?: CompanyDeclarationDTO[];
  }): Report {
    const income = new IncomeBuilder()
      .addPaySlip(paySlip)
      .addCompanyDeclarations(this.entrepreneurRevenuesFactory.createAll(entrepreneurRevenues))
      .build();

    const tax = new Tax(0);

    this.calculateTax(income, tax);

    // Handle upfront payments
    const upfrontPayments = this.calculateUpfrontPayments(userId, tax);

    // Handle deductions
    this.applyDeductions(deductions ?? [], income, tax);

    return {
      taxableIncome: income.taxablePart(),
      toPay: tax.asNumber(),
      paid: upfrontPayments.asNumber(),
    };
  }

  private applyDeductions(deductions: DeductionDTO[], income: Income, tax: Tax) {
    const accumulatedDeductions = new AccumulatedDeductions();
    const allDeductions = this.deductionFactory.createAll(deductions);
    allDeductions.applyTo({
      income,
      tax,
      accumulatedDeductions,
    });

    tax.deduce(accumulatedDeductions.totalApplicable());
  }

  private calculateUpfrontPayments(userId: string, tax: Tax) {
    const upfrontPayments = this.payments.sumUpfrontPayments(userId);
    tax.deduceUpfrontPayments(upfrontPayments);

    return upfrontPayments;
  }

  private calculateTax(income: Income, tax: Tax) {
    const workingIncome = income.toWorkingIncome();

    // Apply the various rates
    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      if (rate.isApplicable(workingIncome)) {
        rate.apply(workingIncome, tax);
      }
    }
  }
}
