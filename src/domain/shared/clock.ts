import { Year } from "./year.js";

export interface Clock {
  currentYear(): Year;
}
