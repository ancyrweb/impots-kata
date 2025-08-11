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

describe("Behavior: citizen declaring dividends", () => {
  test("Rule: 30% of the dividends are added to the tax", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 0,
      dividends: [
        {
          companyId: "company-id",
          amount: 1_000,
        },
      ],
    });

    expect(tax.toPay).toBe(300);
  });
});
