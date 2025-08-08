import { TaxCalculator } from "../../src/domain/tax-calculator.js";
import { InMemoryPayments } from "../../src/infrastructure/for-tests/in-memory-payments.js";

const setup = (config?: {}) => {
  const calculator = new TaxCalculator({
    payments: new InMemoryPayments(),
  });

  return { calculator };
};

describe("rates", () => {
  test("no income = no tax", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 0,
    });

    expect(tax.toPay).toBe(0);
  });

  test("below 10k, no tax", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 10_000,
    });

    expect(tax.toPay).toBe(0);
  });

  test("starting at 10k, the tax is 10%", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 15_000,
    });

    expect(tax.toPay).toBe(500);
  });

  test("up to 20k, the tax is 10%", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 20_000,
    });

    expect(tax.toPay).toBe(1_000);
  });

  test("starting at 20k, the tax is 18%", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
    });

    expect(tax.toPay).toBe(1_900);
  });

  test("up to 30k, the tax is 18%", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 30_000,
    });

    expect(tax.toPay).toBe(2_800);
  });
});

describe("taxable income", () => {
  test("below 10k, taxable income is zero", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 0,
    });

    expect(tax.taxableIncome).toBe(0);
  });

  test("over 10k, taxable income is whatever is left", () => {
    const { calculator } = setup();
    const tax = calculator.calculate({
      userId: "user-id",
      paySlip: 25_000,
    });

    expect(tax.taxableIncome).toBe(25_000 - 10_000);
  });
});
