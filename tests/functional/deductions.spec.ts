import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

const setup = () => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
  });

  return { calculator };
};

describe("Behavior: applying deductions", () => {
  const EXPECTED_TAX = 1_900;

  test("Scenario: no deduction applied", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
    });

    expect(tax.toPay).toBe(EXPECTED_TAX);
  });

  test("Scenario: fixed deduction", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
      deductions: [
        {
          type: "fixed",
          value: 400,
        },
      ],
    });

    expect(tax.toPay).toBe(EXPECTED_TAX - 400);
  });

  test("Scenario: percentage deduction", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
      deductions: [
        {
          type: "percentage",
          value: 0.5,
        },
      ],
    });

    expect(tax.toPay).toBe(EXPECTED_TAX * 0.5);
  });
});

describe("Behavior: applying multiple reductions", () => {
  const EXPECTED_TAX = 1_900;

  test("Scenario: only the biggest percentage reduction is applied", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
      deductions: [
        {
          type: "percentage",
          value: 0.5,
        },
        {
          type: "percentage",
          value: 0.1,
        },
      ],
    });

    expect(tax.toPay).toBe(EXPECTED_TAX * 0.5);
  });
});
