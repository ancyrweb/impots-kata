import { TaxCalculator } from "../../src/tax-calculator.js";

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

test.each(examples)(
  "when the citizen has an income of $income, the tax should be $tax",
  ({ income, tax }) => {
    const taxCalculator = new TaxCalculator();
    const calculatedTax: number = taxCalculator.calculate(income);
    expect(calculatedTax).toBe(tax);
  },
);
