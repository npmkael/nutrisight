import { MealTimeKey } from "@/utils/mealIcons";

export type FoodRecommendation = {
  id?: string;
  name: string;
  description: string;
  mealTime: MealTimeKey;
  category?: string;
  servingSize: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
  prepTime?: string;
};

export type MealDistribution = {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
};

export type AppliedFilters = {
  highProtein: boolean;
  highCarbs: boolean;
  highFat: boolean;
  highCal: boolean;
};

export type FoodItem = {
  name: string;
  servingSize: string;
  calories: string;
  carbs: string;
  protein: string;
  fat: string;
};

export type ApiRecommendationsResponse = {
  message: string;
  recommendations: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  mealDistribution: MealDistribution;
  appliedFilters: AppliedFilters;
};

export type FoodRecommendationsResponse = ApiRecommendationsResponse;
