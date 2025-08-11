import { Year } from "../shared/year.js";

export class Company {
  private readonly id: string;
  private readonly ownerId: string;
  private readonly yearOfCreation: Year;
  private readonly city: string;

  constructor({
    id,
    ownerId,
    yearOfCreation,
    city,
  }: {
    id: string;
    ownerId: string;
    yearOfCreation: Year;
    city: string;
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.yearOfCreation = yearOfCreation;
    this.city = city;
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

  getCity() {
    return this.city;
  }
}
