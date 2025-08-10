import { TaxCalculator } from "../../src/application/tax-calculation/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";
import { InMemoryClock } from "../../src/infrastructure/for-tests/in-memory-clock.js";
import { InMemoryCompanies } from "../../src/infrastructure/for-tests/in-memory-companies.js";
import { CompanyTestFactory } from "../utils/company-test-factory.js";
import { Year } from "../../src/domain/shared/year.js";

const setup = ({
  companyCreationYear,
  currentYear,
}: {
  companyCreationYear: Year;
  currentYear: Year;
}) => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
    companies: new InMemoryCompanies([
      CompanyTestFactory.create({
        id: "company-id",
        ownerId: "user-id",
        yearOfCreation: companyCreationYear,
      }),
    ]),
    clock: new InMemoryClock(currentYear),
  });

  return { calculator };
};

describe("Behavior: allowance depending on the year of creation", () => {
  test("Scenario: companies dont pay taxes the first year", () => {
    const { calculator } = setup({
      companyCreationYear: new Year(2024),
      currentYear: new Year(2025),
    });

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

    expect(tax.toPay).toBe(0);
  });

  test("Scenario: companies pay taxes on subsequent years", () => {
    const { calculator } = setup({
      companyCreationYear: new Year(2024),
      currentYear: new Year(2026),
    });

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

    expect(tax.toPay).not.toBe(0);
  });
});
