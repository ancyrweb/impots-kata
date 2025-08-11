import { FixedAllowance } from "./fixed-allowance.js";
import { Percentage } from "../shared/percentage.js";
import { TieredAllowance } from "./tiered-allowance.js";

export class AllowanceConfiguration {
  get(city: string, type: "services" | "commercial") {
    if (city === "Amb") {
      switch (type) {
        case "services":
          return new FixedAllowance(Percentage.fromDecimal(0.25));
        case "commercial":
          return new FixedAllowance(Percentage.fromDecimal(0.51));
        default:
          throw new Error(`Unknown company revenue type: ${type}`);
      }
    }

    switch (type) {
      case "services":
        return new TieredAllowance([Percentage.fromDecimal(1), Percentage.fromDecimal(0.34)]);
      case "commercial":
        return new TieredAllowance([Percentage.fromDecimal(1), Percentage.fromDecimal(0.71)]);
      default:
        throw new Error(`Unknown company revenue type: ${type}`);
    }
  }
}
