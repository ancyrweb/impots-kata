import { Payments } from "../../domain/payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deduction-factory.js";
import {
  CompanyDeclarationDTO,
  CompanyDeclarationsFactory,
} from "./company-declarations-factory.js";
import { Report, TaxCalculation } from "../../domain/tax-calculation.js";
import { Companies } from "../../domain/companies/companies.js";
import { Clock } from "../../domain/shared/clock.js";
import { DividendDTO, DividendFactory } from "./dividend-factory.js";

export class TaxCalculator {
  private readonly payments: Payments;
  private readonly companies: Companies;
  private readonly clock: Clock;

  private readonly deductionFactory: DeductionFactory;
  private readonly companyDeclarationsFactory: CompanyDeclarationsFactory;
  private readonly dividendsFactory: DividendFactory;

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

    this.deductionFactory = new DeductionFactory();
    this.companyDeclarationsFactory = new CompanyDeclarationsFactory(this.companies);
    this.dividendsFactory = new DividendFactory();
  }

  calculate({
    userId,
    paySlip,
    deductions,
    entrepreneurRevenues,
    dividends,
  }: {
    userId: string;
    paySlip: number;
    deductions?: DeductionDTO[];
    entrepreneurRevenues?: CompanyDeclarationDTO[];
    dividends?: DividendDTO[];
  }): Report {
    const calculation = new TaxCalculation({
      paySlip,
      deductions: this.deductionFactory.createAll(deductions ?? []),
      entrepreneurRevenues: this.companyDeclarationsFactory.createAll(userId, entrepreneurRevenues),
      upfrontPayments: this.payments.sumUpfrontPayments(userId),
      dividends: this.dividendsFactory.createAll(dividends ?? []),
      currentYear: this.clock.currentYear(),
    });

    calculation.calculate();

    return calculation.getReport();
  }
}
