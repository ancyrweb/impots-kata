import { Allowance } from "./allowance.js";
import { Percentage } from "../shared/percentage.js";

export class AllowanceConfiguration {
  get(city: string, type: "services" | "commercial") {
    if (city === "Amb") {
      switch (type) {
        case "services":
          return new Allowance(Percentage.fromDecimal(0.25));
        case "commercial":
          return new Allowance(Percentage.fromDecimal(0.51));
        default:
          throw new Error(`Unknown company revenue type: ${type}`);
      }
    }

    switch (type) {
      case "services":
        return new Allowance(Percentage.fromDecimal(0.34));
      case "commercial":
        return new Allowance(Percentage.fromDecimal(0.71));
      default:
        throw new Error(`Unknown company revenue type: ${type}`);
    }
  }
}
