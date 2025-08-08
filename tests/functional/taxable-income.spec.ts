import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

const setup = () => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
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
