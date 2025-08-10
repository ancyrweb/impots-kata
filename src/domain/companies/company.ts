import { Year } from "../shared/year.js";

export class Company {
  private readonly id: string;
  private readonly ownerId: string;
  private readonly yearOfCreation: Year;

  constructor({
    id,
    ownerId,
    yearOfCreation,
  }: {
    id: string;
    ownerId: string;
    yearOfCreation: Year;
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.yearOfCreation = yearOfCreation;
  }

  belongsTo(ownerId: string): boolean {
    return this.ownerId === ownerId;
  }

  isDeclarationLegal(currentYear: Year) {
    return !this.yearOfCreation.equals(currentYear);
  }

  isFirstYear(currentYear: Year) {
    return this.yearOfCreation.equals(currentYear.minus(1));
  }

  getId() {
    return this.id;
  }
}
