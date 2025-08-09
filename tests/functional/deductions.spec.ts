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

  test("Scenario: percentages deduction are applied before fixed ones", () => {
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
          type: "fixed",
          value: 200,
        },
      ],
    });

    expect(tax.toPay).toBe(EXPECTED_TAX * 0.5 - 200);
  });
});

describe("Behavior: conditional reductions", () => {
  test("Scenario: by default, a deduction apply without condition", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
      deductions: [
        {
          type: "fixed",
          value: 100,
        },
      ],
    });

    expect(tax.toPay).toBe(1900 - 100);
  });

  describe("Behavior: tax threshold", () => {
    test("Scenario: when the tax is BELOW the threshold, the deduction is NOT applied", () => {
      const { calculator } = setup();
      const tax = calculator.calculate({
        userId: "user-id",
        paySlip: 25_000,
        deductions: [
          {
            type: "fixed",
            value: 100,
            condition: {
              type: "tax-threshold",
              value: 2_000,
            },
          },
        ],
      });

      expect(tax.toPay).toBe(1900);
    });

    test("Scenario: when the tax is EQUAL to the threshold, the deduction is applied", () => {
      const { calculator } = setup();
      const tax = calculator.calculate({
        userId: "user-id",
        paySlip: 25_000,
        deductions: [
          {
            type: "fixed",
            value: 100,
            condition: {
              type: "tax-threshold",
              value: 1_900,
            },
          },
        ],
      });

      expect(tax.toPay).toBe(1900 - 100);
    });

    test("Scenario: when the tax is ABOVE to the threshold, the deduction is applied", () => {
      const { calculator } = setup();
      const tax = calculator.calculate({
        userId: "user-id",
        paySlip: 25_000,
        deductions: [
          {
            type: "fixed",
            value: 100,
            condition: {
              type: "tax-threshold",
              value: 1_800,
            },
          },
        ],
      });

      expect(tax.toPay).toBe(1900 - 100);
    });
  });
});
