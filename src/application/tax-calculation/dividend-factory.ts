import { Dividend } from "../../domain/dividends/dividend.js";

export type DividendDTO = {
  companyId: string;
  amount: number;
};

export class DividendFactory {
  createAll(dtos: DividendDTO[]): Dividend[] {
    return dtos.map((dto) => new Dividend(dto.amount));
  }
}
