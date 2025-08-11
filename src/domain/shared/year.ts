export class Year {
  constructor(public year: number) {}

  equals(currentYear: Year) {
    return this.year === currentYear.year;
  }

  minus(number: number) {
    return new Year(this.year - number);
  }

  difference(yearOfCreation: Year) {
    return this.year - yearOfCreation.year;
  }
}
