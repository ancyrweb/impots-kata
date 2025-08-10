import { Rate } from "./tax/rate.js";
import { Tax } from "./tax/tax.js";
import { Income } from "./tax/income.js";
import { Deductions } from "./deductions/deductions.js";
import { CompanyDeclaration } from "./companies/company-declaration.js";
import { IncomeBuilder } from "./tax/income-builder.js";
import { AccumulatedDeductions } from "./tax/accumulated-deductions.js";
import { SumOfUpfrontPayments } from "./payments/sum-of-upfront-payments.js";

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

  private report: Report = {
    taxableIncome: 0,
    toPay: 0,
    paid: 0,
  };

  private tax: Tax;
  private income: Income;
  private upfrontPayments: SumOfUpfrontPayments;
  private deductions: Deductions;

  constructor({
    paySlip,
    deductions,
    entrepreneurRevenues,
    upfrontPayments,
  }: {
    paySlip: number;
    deductions: Deductions;
    entrepreneurRevenues: CompanyDeclaration[];
    upfrontPayments: SumOfUpfrontPayments;
  }) {
    this.tax = new Tax(0);
    this.income = new IncomeBuilder()
      .addPaySlip(paySlip)
      .addCompanyDeclarations(entrepreneurRevenues)
      .build();

    this.upfrontPayments = upfrontPayments;
    this.deductions = deductions;
  }

  calculate() {
    this.calculateTax();
    this.deduceUpfrontPayments();
    this.applyDeductions();

    // Complete the report
    this.report.toPay = this.tax.asNumber();
    this.report.taxableIncome = this.income.taxablePart();
  }

  getReport() {
    return this.report;
  }

  private applyDeductions() {
    const accumulatedDeductions = new AccumulatedDeductions();
    this.deductions.applyTo({
      income: this.income,
      tax: this.tax,
      accumulatedDeductions,
    });

    this.tax.deduce(accumulatedDeductions.totalApplicable());
  }

  private deduceUpfrontPayments() {
    this.tax.deduceUpfrontPayments(this.upfrontPayments!);

    this.report.paid = this.upfrontPayments!.asNumber();
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
