import { FixedAllowance } from "./fixed-allowance.js";
import { Percentage } from "../../shared/percentage.js";
import { TieredAllowance } from "./tiered-allowance.js";
import { Allowance } from "./allowance.js";

type CityName = string;
const configuration: Record<CityName, Record<"services" | "commercial", Allowance>> = {
  Amb: {
    services: new FixedAllowance(Percentage.fromDecimal(0.25)),
    commercial: new FixedAllowance(Percentage.fromDecimal(0.51)),
  },
  Tabhati: {
    services: new TieredAllowance([
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(0.34),
    ]),
    commercial: new TieredAllowance([
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(0.71),
    ]),
  },
  Borginopolis: {
    services: new TieredAllowance([
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(0.7),
      Percentage.fromDecimal(0.34),
    ]),
    commercial: new TieredAllowance([
      Percentage.fromDecimal(1),
      Percentage.fromDecimal(0.87),
      Percentage.fromDecimal(0.71),
    ]),
  },
  default: {
    services: new TieredAllowance([Percentage.fromDecimal(1), Percentage.fromDecimal(0.34)]),
    commercial: new TieredAllowance([Percentage.fromDecimal(1), Percentage.fromDecimal(0.71)]),
  },
} as const;

export class AllowanceConfiguration {
  get(city: string, type: "services" | "commercial") {
    const config = configuration[city] ?? configuration.default;

    const allowance = config[type];
    if (!allowance) {
      throw new Error(`Unknown company revenue type: ${type} for city: ${city}`);
    }

    return allowance;
  }
}
