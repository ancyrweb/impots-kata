import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

describe("Behavior: deducing past payments", () => {
  describe("Scenario: no payment", () => {
    test("when the user has made no upfront payments, no deduction should be made", () => {
      const taxCalculator = new TaxCalculator({
        payments: new InMemoryPayments(),
      });

      const calculatedTax: number = taxCalculator.calculate({
        userId: "user",
        paySlip: 25_000,
      });

      expect(calculatedTax).toBe(1_900);
    });
  });

  describe("Scenario: past payments", () => {
    test("when the user has paid 900 Borgis, they should be deduced from the tax", () => {
      const payments = new InMemoryPayments({
        user: 900,
      });

      const taxCalculator = new TaxCalculator({
        payments,
      });

      const calculatedTax: number = taxCalculator.calculate({
        userId: "user",
        paySlip: 25_000,
      });

      expect(calculatedTax).toBe(1_000);
    });
  });
});
