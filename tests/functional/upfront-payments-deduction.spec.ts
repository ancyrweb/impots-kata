import { TaxCalculator } from "../../src/application/tax-calculation/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";
import { InMemoryCompanies } from "../../src/infrastructure/for-tests/in-memory-companies.js";
import { InMemoryClock } from "../../src/infrastructure/for-tests/in-memory-clock.js";

describe("Behavior: deducing past payments", () => {
  describe("Scenario: no payment", () => {
    test("when the user has made no upfront payments, no deduction should be made", () => {
      const taxCalculator = new TaxCalculator({
        payments: new InMemoryPayments(),
        companies: new InMemoryCompanies(),
        clock: new InMemoryClock(),
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
        companies: new InMemoryCompanies(),
        clock: new InMemoryClock(),
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
