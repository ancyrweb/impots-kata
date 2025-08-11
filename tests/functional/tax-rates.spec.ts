import { TaxCalculator } from "../../src/application/tax-calculation/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";
import { InMemoryCompanies } from "../../src/infrastructure/for-tests/in-memory-companies.js";
import { InMemoryClock } from "../../src/infrastructure/for-tests/in-memory-clock.js";

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
    income: 29_000,
    tax: 2_620,
  },
  {
    income: 35_000,
    tax: 4_050,
  },
  {
    income: 49_000,
    tax: 7_550,
  },
  {
    income: 66_000,
    tax: 12_600,
  },
  {
    income: 75_000,
    tax: 15_300,
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
        companies: new InMemoryCompanies(),
        clock: new InMemoryClock(),
      });

      const report = taxCalculator.calculate({
        userId: "user",
        paySlip: income,
      });

      expect(report.toPay).toBe(tax);
    },
  );
});
