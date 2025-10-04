export interface Allergen {
  id: string;
  name: string;
  category: "common" | "other";
}

export interface NutritionItem {
  name?: string;
  unit?: string;
  value?: number | string;
  calorie?: number;
}

export interface NutritionCategory {
  items?: NutritionItem[];
}

export interface MealEntry {
  calorie?: number;
  nutritionData?: NutritionCategory[];
}
