import { Payments } from "../../domain/payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deduction-factory.js";
import {
  CompanyDeclarationDTO,
  CompanyDeclarationsFactory,
} from "./company-declarations-factory.js";
import { Report, TaxCalculation } from "../../domain/tax-calculation.js";
import { Companies } from "../../domain/companies/companies.js";
import { Clock } from "../../domain/shared/clock.js";

export class TaxCalculator {
  private readonly payments: Payments;
  private readonly companies: Companies;
  private readonly clock: Clock;

  private readonly deductionFactory: DeductionFactory;
  private readonly companyDeclarationsFactory: CompanyDeclarationsFactory;

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
      entrepreneurRevenues: this.companyDeclarationsFactory.createAll(userId, entrepreneurRevenues),
      upfrontPayments: this.payments.sumUpfrontPayments(userId),
      currentYear: this.clock.currentYear(),
    });

    calculation.calculate();

    return calculation.getReport();
  }
}
