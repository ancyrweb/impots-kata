import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";
import { InMemoryCompanies } from "../../src/infrastructure/for-tests/in-memory-companies.js";
import { InMemoryClock } from "../../src/infrastructure/for-tests/in-memory-clock.js";

const setup = () => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
    companies: new InMemoryCompanies(),
    clock: new InMemoryClock(),
  });

  return { calculator };
};

describe("Behavior: taxable income", () => {
  test("Scenario: any income below 10k is tax-free", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 10_000,
    });

    expect(tax.taxableIncome).toBe(0);
  });

  test("Scenario: any income above 10k is taxable", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
    });

    expect(tax.taxableIncome).toBe(25_000 - 10_000);
  });
});
