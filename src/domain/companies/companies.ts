import { Company } from "./company.js";

export interface Companies {
  findByUserId(userId: string): Company[];
}
