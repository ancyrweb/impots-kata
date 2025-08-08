import { TaxCalculator } from "../../src/tax-calculator.js";

const setup = (config?: {}) => {
  const calculator = new TaxCalculator();

  return { calculator };
};

test("no income = no tax", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(0);
  expect(tax).toBe(0);
});

test("below 10k, no tax", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(10_000);
  expect(tax).toBe(0);
});

test("starting at 10k, the tax is 10%", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(15_000);
  expect(tax).toBe(500);
});

test("up to 20k, the tax is 10%", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(20_000);
  expect(tax).toBe(1_000);
});

test("starting at 20k, the tax is 18%", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(25_000);
  expect(tax).toBe(1_900);
});

test("up to 30k, the tax is 18%", () => {
  const { calculator } = setup();
  const tax: number = calculator.calculate(30_000);
  expect(tax).toBe(2_800);
});
