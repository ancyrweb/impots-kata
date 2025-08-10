import { Rate } from "./tax/rate.js";
import { Payments } from "./payments/payments.js";
import { Tax } from "./tax/tax.js";
import { Income } from "./tax/income.js";
import { Deductions } from "./deductions/deductions.js";
import { CompanyDeclaration } from "./companies/company-declaration.js";
import { IncomeBuilder } from "./tax/income-builder.js";
import { AccumulatedDeductions } from "./tax/accumulated-deductions.js";

export type Report = {
  taxableIncome: number;
  toPay: number;
  paid: number;
};

export class TaxCalculation {
  private rates = [
    new Rate(50_000, 0.3),
    new Rate(30_000, 0.25),
    new Rate(20_000, 0.18),
    new Rate(10_000, 0.1),
  ];

  private readonly payments: Payments;

  private report: Report = {
    taxableIncome: 0,
    toPay: 0,
    paid: 0,
  };

  private tax: Tax = new Tax(0);
  private income: Income = new Income(0);

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
    deductions: Deductions;
    entrepreneurRevenues: CompanyDeclaration[];
  }) {
    // Calculate the total income
    this.income = new IncomeBuilder()
      .addPaySlip(paySlip)
      .addCompanyDeclarations(entrepreneurRevenues)
      .build();

    // Calculate final tax
    this.calculateTax();
    this.deduceUpfrontPayments(userId);
    this.applyDeductions(deductions ?? []);

    // Complete the report
    this.report.toPay = this.tax.asNumber();
    this.report.taxableIncome = this.income.taxablePart();
  }

  getReport() {
    return this.report;
  }

  private applyDeductions(deductions: Deductions) {
    const accumulatedDeductions = new AccumulatedDeductions();
    deductions.applyTo({
      income: this.income,
      tax: this.tax,
      accumulatedDeductions,
    });

    this.tax.deduce(accumulatedDeductions.totalApplicable());
  }

  private deduceUpfrontPayments(userId: string) {
    const upfrontPayments = this.payments.sumUpfrontPayments(userId);
    this.tax.deduceUpfrontPayments(upfrontPayments);

    this.report.paid = upfrontPayments.asNumber();
  }

  private calculateTax() {
    const workingIncome = this.income.toWorkingIncome();

    // Apply the various rates
    for (let i = 0; i < this.rates.length; i++) {
      const rate = this.rates[i];
      if (rate.isApplicable(workingIncome)) {
        rate.apply(workingIncome, this.tax);
      }
    }
  }
}
