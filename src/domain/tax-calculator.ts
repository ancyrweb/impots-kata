import { Payments } from "./payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deductions/deduction-factory.js";
import {
  CompanyDeclarationDTO,
  CompanyDeclarationsFactory,
} from "./companies/company-declarations-factory.js";
import { Report, TaxCalculation } from "./tax-calculation.js";
import { Companies } from "./companies/companies.js";
import { Clock } from "./shared/clock.js";

export class TaxCalculator {
  private readonly payments: Payments;
  private readonly companies: Companies;
  private readonly clock: Clock;

  private readonly deductionFactory = new DeductionFactory();
  private readonly entrepreneurRevenuesFactory = new CompanyDeclarationsFactory();

  constructor({
    payments,
    companies,
    clock,
  }: {
    payments: Payments;
    companies: Companies;
    clock: Clock;
  }) {
    this.payments = payments;
    this.companies = companies;
    this.clock = clock;
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
    const calculation = new TaxCalculation({
      paySlip,
      deductions: this.deductionFactory.createAll(deductions ?? []),
      entrepreneurRevenues: this.entrepreneurRevenuesFactory.createAll(entrepreneurRevenues),
      upfrontPayments: this.payments.sumUpfrontPayments(userId),
    });

    calculation.calculate();

    return calculation.getReport();
  }
}
