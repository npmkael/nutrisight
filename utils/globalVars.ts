import { Allergen } from "./types";

export const commonAllergens: Allergen[] = [
  { id: "peanuts", name: "Peanuts", category: "common" },
  { id: "milk", name: "Milk", category: "common" },
  { id: "eggs", name: "Eggs", category: "common" },
  { id: "soy", name: "Soy", category: "common" },
  { id: "wheat", name: "Wheat", category: "common" },
  { id: "fish", name: "Fish", category: "common" },
];

export const otherAllergens: Allergen[] = [
  { id: "sesame", name: "Sesame", category: "other" },
  { id: "sulfites", name: "Sulfites", category: "other" },
  { id: "celery", name: "Celery", category: "other" },
  { id: "mustard", name: "Mustard", category: "other" },
  { id: "lupin", name: "Lupin", category: "other" },
  { id: "molluscs", name: "Molluscs", category: "other" },
  { id: "gluten", name: "Gluten", category: "other" },
  { id: "lactose", name: "Lactose", category: "other" },
  { id: "fructose", name: "Fructose", category: "other" },
  { id: "histamine", name: "Histamine", category: "other" },
  { id: "nightshades", name: "Nightshades", category: "other" },
  { id: "dairy", name: "Dairy", category: "other" },
  { id: "none", name: "No allergies", category: "other" },
];
