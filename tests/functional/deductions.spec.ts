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
  describe("Behavior: no condition", () => {
    test("Scenario: deduction applies unconditionally", () => {
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
  });

  describe("Behavior: tax threshold", () => {
    const calculate = ({ threshold }: { threshold: number }) => ({
      totalToPay: setup().calculator.calculate({
        userId: "user-id",
        paySlip: 25_000,
        deductions: [
          {
            type: "fixed",
            value: 100,
            condition: {
              type: "tax-threshold",
              value: threshold,
            },
          },
        ],
      }).toPay,
      taxBeforeDeductions: 1_900,
      deductionValue: 100,
    });

    test("Scenario: when the tax is BELOW the threshold, the deduction is NOT applied", () => {
      const { totalToPay, taxBeforeDeductions } = calculate({
        threshold: 2_000,
      });

      expect(totalToPay).toBe(taxBeforeDeductions);
    });

    test("Scenario: when the tax is EQUAL to the threshold, the deduction is applied", () => {
      const { totalToPay, taxBeforeDeductions, deductionValue } = calculate({
        threshold: 1_900,
      });

      expect(totalToPay).toBe(taxBeforeDeductions - deductionValue);
    });

    test("Scenario: when the tax is ABOVE to the threshold, the deduction is applied", () => {
      const { totalToPay, taxBeforeDeductions, deductionValue } = calculate({
        threshold: 1_800,
      });

      expect(totalToPay).toBe(taxBeforeDeductions - deductionValue);
    });
  });

  describe("Behavior: taxable income threshold", () => {
    const calculate = ({
      threshold,
      taxableIncome,
    }: {
      threshold: number;
      taxableIncome: number;
    }) => ({
      totalToPay: setup().calculator.calculate({
        userId: "user-id",
        paySlip: 10_000 + taxableIncome,
        deductions: [
          {
            type: "fixed",
            value: 100,
            condition: {
              type: "taxable-income-threshold",
              value: threshold,
            },
          },
        ],
      }).toPay,
      taxBeforeDeductions: 1_900,
      deductionValue: 100,
    });

    test("Scenario: when the tax is BELOW the threshold, the deduction is NOT applied", () => {
      const { totalToPay, taxBeforeDeductions } = calculate({
        taxableIncome: 15_000,
        threshold: 14_900,
      });

      expect(totalToPay).toBe(taxBeforeDeductions);
    });

    test("Scenario: when the tax is EQUAL to the threshold, the deduction is applied", () => {
      const { totalToPay, taxBeforeDeductions, deductionValue } = calculate({
        taxableIncome: 15_000,
        threshold: 15_000,
      });

      expect(totalToPay).toBe(taxBeforeDeductions - deductionValue);
    });

    test("Scenario: when the tax is ABOVE to the threshold, the deduction is applied", () => {
      const { totalToPay, taxBeforeDeductions, deductionValue } = calculate({
        taxableIncome: 15_000,
        threshold: 15_100,
      });

      expect(totalToPay).toBe(taxBeforeDeductions - deductionValue);
    });
  });
});

describe("Behavior: capped deductions", () => {
  test("Scenario: deductions cannot exceed 1 271 Borgis", () => {
    const { calculator } = setup();
    const { toPay } = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
      deductions: [
        {
          type: "fixed",
          value: 1_272,
        },
      ],
    });

    expect(toPay).toBe(1_900 - 1_271);
  });
});
