import { MealTimeKey } from "@/utils/mealIcons";

export type FoodRecommendation = {
  id?: string;
  name: string;
  description: string;
  mealTime: MealTimeKey;
  category?: string;
  calories?: number;
  prepTime?: string;
};

export type MealDistribution = {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string;
};

export type ApiRecommendationsResponse = {
  message: string;
  recommendations: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
  mealDistribution: MealDistribution;
};

export type FoodRecommendationsResponse = ApiRecommendationsResponse;
