import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

const examples = [
  {
    income: 0,
    tax: 0,
  },
  {
    income: 10_000,
    tax: 0,
  },
  {
    income: 15_000,
    tax: 500,
  },
  {
    income: 25_000,
    tax: 1_900,
  },
  {
    income: 35_000,
    tax: 4_050,
  },
  {
    income: 100_000,
    tax: 22_800,
  },
];

describe("Behavior: calculating tax rates", () => {
  test.each(examples)(
    "Scenario: with an income of $income, the tax should be $tax",
    ({ income, tax }) => {
      const taxCalculator = new TaxCalculator({
        payments: new InMemoryPayments(),
      });

      const report = taxCalculator.calculate({
        userId: "user",
        paySlip: income,
      });

      expect(report.toPay).toBe(tax);
    },
  );
});
