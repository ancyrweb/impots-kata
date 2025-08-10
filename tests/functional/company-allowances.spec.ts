import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

const setup = () => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
  });

  return { calculator };
};

describe("Behavior: company revenues", () => {
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
