import { Payments } from "./payments/payments.js";
import { DeductionDTO, DeductionFactory } from "./deductions/deduction-factory.js";
import {
  CompanyDeclarationDTO,
  CompanyDeclarationsFactory,
} from "./companies/company-declarations-factory.js";
import { Report, TaxCalculation } from "./tax-calculation.js";

export class TaxCalculator {
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
    const calculation = new TaxCalculation({
      payments: this.payments,
    });

    calculation.calculate({
      userId,
      paySlip,
      deductions: this.deductionFactory.createAll(deductions ?? []),
      entrepreneurRevenues: this.entrepreneurRevenuesFactory.createAll(entrepreneurRevenues),
    });

    return calculation.getReport();
  }
}
