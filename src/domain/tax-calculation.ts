import { Rate } from "./tax/rate.js";
import { Tax } from "./tax/tax.js";
import { Income } from "./tax/income.js";
import { Deductions } from "./deductions/deductions.js";
import { CompanyDeclaration } from "./companies/company-declaration.js";
import { IncomeBuilder } from "./tax/income-builder.js";
import { AccumulatedDeductions } from "./tax/accumulated-deductions.js";
import { SumOfUpfrontPayments } from "./payments/sum-of-upfront-payments.js";
import { Year } from "./shared/year.js";
import { Dividend } from "./dividends/dividend.js";
import { DividendTaxRuleConfiguration } from "./dividends/dividend-tax-rule-configuration.js";

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
  private dividends: Dividend[];
  private currentYear: Year;

  private dividendTaxRuleConfiguration: DividendTaxRuleConfiguration;

  constructor({
    paySlip,
    deductions,
    entrepreneurRevenues,
    upfrontPayments,
    dividends,
    currentYear,
  }: {
    paySlip: number;
    deductions: Deductions;
    entrepreneurRevenues: CompanyDeclaration[];
    upfrontPayments: SumOfUpfrontPayments;
    dividends: Dividend[];
    currentYear: Year;
  }) {
    this.tax = new Tax(0);
    this.income = new IncomeBuilder(currentYear)
      .addPaySlip(paySlip)
      .addCompanyDeclarations(entrepreneurRevenues)
      .build();

    this.upfrontPayments = upfrontPayments;
    this.deductions = deductions;
    this.dividends = dividends;
    this.currentYear = currentYear;
    this.dividendTaxRuleConfiguration = new DividendTaxRuleConfiguration();
  }

  calculate() {
    this.calculateTax();
    this.deduceUpfrontPayments();
    this.applyDeductions();
    this.applyDividends();

    // Complete the report
    this.report.toPay = this.tax.asNumber();
    this.report.taxableIncome = this.income.taxablePart();
  }

  getReport() {
    return this.report;
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

  private deduceUpfrontPayments() {
    this.tax.deduceUpfrontPayments(this.upfrontPayments);

    this.report.paid = this.upfrontPayments.asNumber();
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

  private applyDividends() {
    for (const dividend of this.dividends) {
      const rule = this.dividendTaxRuleConfiguration.get(dividend.getCompany().getCity());
      const tax = rule.computeTax(dividend, this.currentYear);
      this.tax.addTax(tax);
    }
  }
}
