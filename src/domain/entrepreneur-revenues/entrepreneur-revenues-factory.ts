import { Percentage } from "../percentage.js";

export type EntrepreneurRevenueDTO = {
  type: "services" | "commercial";
  revenues: number;
};

export class EntrepreneurRevenue {
  static forServices(revenues: number) {
    return new EntrepreneurRevenue(Percentage.fromDecimal(0.34).complement(), revenues);
  }

  static forCommercial(revenues: number) {
    return new EntrepreneurRevenue(Percentage.fromDecimal(0.71).complement(), revenues);
  }

  constructor(
    private readonly allowance: Percentage,
    private readonly revenues: number,
  ) {}

  applicableRevenues() {
    return this.allowance.applyTo(this.revenues);
  }
}

export class EntrepreneurRevenuesFactory {
  createAll(dtos?: EntrepreneurRevenueDTO[]): EntrepreneurRevenue[] {
    if (!dtos) {
      return [];
    }

    return dtos.map((dto) => {
      switch (dto.type) {
        case "services":
          return EntrepreneurRevenue.forServices(dto.revenues);
        case "commercial":
          return EntrepreneurRevenue.forCommercial(dto.revenues);
        default:
          throw new Error(`Unknown entrepreneur revenue type: ${dto.type}`);
      }
    });
  }
}
