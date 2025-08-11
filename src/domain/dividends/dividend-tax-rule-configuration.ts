import { FixedDividendTaxRule } from "./fixed-dividend-tax-rule.js";
import { Percentage } from "../shared/percentage.js";
import { DividendTaxRule } from "./dividend-tax-rule.js";
import { TieredDividendTaxRule } from "./tiered-dividend-tax-rule.js";

type CityName = string;
const configuration: Record<CityName, DividendTaxRule> = {
  Amb: new FixedDividendTaxRule(Percentage.fromDecimal(0.25)),
  Tabhati: new TieredDividendTaxRule([
    Percentage.fromDecimal(0),
    Percentage.fromDecimal(0),
    Percentage.fromDecimal(0),
    Percentage.fromDecimal(0.3),
  ]),
  // TODO : this, but too lazy
  Borginopolis: new FixedDividendTaxRule(Percentage.fromDecimal(0.3)),
  default: new FixedDividendTaxRule(Percentage.fromDecimal(0.3)),
} as const;

export class DividendTaxRuleConfiguration {
  get(city: string) {
    const config = configuration[city] ?? configuration.default;
    if (!config) {
      throw new Error(`Unknown dividend tax rule for city: ${city}`);
    }

    return config;
  }
}
