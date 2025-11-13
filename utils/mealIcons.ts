export type MealTimeKey =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "snacks"
  | string;

type IconConfig = {
  name: string;
  color: string;
  backgroundColor: string;
};

const accentColors = {
  sunrise: "#FFB74D",
  midday: "#4FC3F7",
  evening: "#9575CD",
  snack: "#81C784",
};

const defaultIconConfig: IconConfig = {
  name: "restaurant-outline",
  color: "#2D3644",
  backgroundColor: "rgba(45, 54, 68, 0.12)",
};

const iconMap: Record<string, IconConfig> = {
  breakfast: {
    name: "sunny-outline",
    color: accentColors.sunrise,
    backgroundColor: "rgba(255, 183, 77, 0.25)",
  },
  lunch: {
    name: "fast-food-outline",
    color: accentColors.midday,
    backgroundColor: "rgba(79, 195, 247, 0.25)",
  },
  dinner: {
    name: "moon-outline",
    color: accentColors.evening,
    backgroundColor: "rgba(149, 117, 205, 0.25)",
  },
  snack: {
    name: "pizza-outline",
    color: accentColors.snack,
    backgroundColor: "rgba(129, 199, 132, 0.25)",
  },
  snacks: {
    name: "pizza-outline",
    color: accentColors.snack,
    backgroundColor: "rgba(129, 199, 132, 0.25)",
  },
};

export const getMealIconConfig = (mealTime?: MealTimeKey): IconConfig => {
  if (!mealTime) return defaultIconConfig;
  const key = mealTime.toLowerCase();
  return iconMap[key] ?? defaultIconConfig;
};
