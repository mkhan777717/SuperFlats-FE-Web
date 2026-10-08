import type { OwnerProperty } from "./types";

const COUNT_KEY: Record<string, keyof OwnerProperty> = {
  "1RK": "count_1rk",
  "1BHK": "count_1bhk",
  "2BHK": "count_2bhk",
  "3BHK": "count_3bhk",
  "3BHK+": "count_3bhk_plus",
};

/**
 * Units of a type the property still has room for. The backend decrements these
 * counts as flats are added. Shared by server pages and client forms.
 */
export const unitsLeft = (property: OwnerProperty, type: string) => Number(property[COUNT_KEY[type]!] ?? 0);
