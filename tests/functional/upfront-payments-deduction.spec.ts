import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

describe("Behavior: deducing past payments", () => {
  describe("Scenario: no payment", () => {
    test("when the user has made no upfront payments, no deduction should be made", () => {
      const taxCalculator = new TaxCalculator({
        payments: new InMemoryPayments(),
      });

      const report = taxCalculator.calculate({
        userId: "user",
        paySlip: 25_000,
      });

      expect(report.toPay).toBe(1_900);
      expect(report.paid).toBe(0);
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

      const report = taxCalculator.calculate({
        userId: "user",
        paySlip: 25_000,
      });

      expect(report.toPay).toBe(1_000);
      expect(report.paid).toBe(900);
    });
  });
});
