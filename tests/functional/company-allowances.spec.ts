import { TaxCalculator } from "../../src/application/tax-calculation/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";
import { InMemoryClock } from "../../src/infrastructure/for-tests/in-memory-clock.js";
import { InMemoryCompanies } from "../../src/infrastructure/for-tests/in-memory-companies.js";
import { CompanyTestFactory } from "../utils/company-test-factory.js";
import { Year } from "../../src/domain/shared/year.js";

const setup = () => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
    companies: new InMemoryCompanies([
      CompanyTestFactory.create({
        id: "company-id",
        ownerId: "user-id",
        yearOfCreation: new Year(2000),
      }),
    ]),
    clock: new InMemoryClock(new Year(2025)),
  });

  return { calculator };
};

describe("Behavior: company allowances", () => {
  test("Scenario: services revenues have 34% allowance", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 0,
      entrepreneurRevenues: [
        {
          companyId: "company-id",
          type: "services",
          revenues: 100_000,
        },
      ],
    });

    expect(tax.toPay).toBe(12_600);
  });

  test("Scenario: commercial activities revenues have 71% allowance", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 0,
      entrepreneurRevenues: [
        {
          companyId: "company-id",
          type: "commercial",
          revenues: 100_000,
        },
      ],
    });

    expect(tax.toPay).toBe(2_620);
  });
});
