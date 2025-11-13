import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FoodRecommendation,
  FoodRecommendationsResponse,
  MealDistribution,
} from "@/constants/foodRecommendations";
import { BACKEND_URL } from "@/context/AuthContext";

const breakfastDescriptions = [
  (name: string) => `Delicious ${name.toLowerCase()} to start your day right.`,
  (name: string) =>
    `Energizing ${name.toLowerCase()} to kickstart your morning.`,
  (name: string) => `Wholesome ${name.toLowerCase()} for a perfect breakfast.`,
  (name: string) => `Rise and shine with this tasty ${name.toLowerCase()}.`,
  (name: string) => `Fuel your morning with ${name.toLowerCase()}.`,
  (name: string) => `Wake up to the goodness of ${name.toLowerCase()}.`,
  (name: string) => `Start fresh with this nutritious ${name.toLowerCase()}.`,
  (name: string) => `Bright morning begins with ${name.toLowerCase()}.`,
  (name: string) => `Breakfast bliss with ${name.toLowerCase()}.`,
  (name: string) => `Power up your morning with ${name.toLowerCase()}.`,
  (name: string) => `A hearty ${name.toLowerCase()} to begin your day.`,
  (name: string) => `Morning energy from ${name.toLowerCase()}.`,
];

const lunchDescriptions = [
  (name: string) => `Nutritious ${name.toLowerCase()} to fuel your afternoon.`,
  (name: string) => `Satisfying ${name.toLowerCase()} for your midday meal.`,
  (name: string) => `Power through your day with this ${name.toLowerCase()}.`,
  (name: string) => `Delicious ${name.toLowerCase()} to keep you going.`,
  (name: string) => `Enjoy a balanced ${name.toLowerCase()} for lunch.`,
  (name: string) => `Midday boost with ${name.toLowerCase()}.`,
  (name: string) => `Recharge with this filling ${name.toLowerCase()}.`,
  (name: string) => `Lunchtime favorite: ${name.toLowerCase()}.`,
  (name: string) => `Stay energized with ${name.toLowerCase()}.`,
  (name: string) => `Perfect midday meal of ${name.toLowerCase()}.`,
  (name: string) => `Refresh your afternoon with ${name.toLowerCase()}.`,
  (name: string) => `A wholesome ${name.toLowerCase()} for lunch.`,
];

const dinnerDescriptions = [
  (name: string) => `Satisfying ${name.toLowerCase()} to end your day well.`,
  (name: string) => `Unwind with this delicious ${name.toLowerCase()}.`,
  (name: string) => `Perfect ${name.toLowerCase()} for a restful evening.`,
  (name: string) => `Wholesome ${name.toLowerCase()} to complete your day.`,
  (name: string) => `End your day right with ${name.toLowerCase()}.`,
  (name: string) => `Evening comfort with ${name.toLowerCase()}.`,
  (name: string) => `Wind down with tasty ${name.toLowerCase()}.`,
  (name: string) => `Nourishing ${name.toLowerCase()} for dinner.`,
  (name: string) => `Relax and enjoy this ${name.toLowerCase()}.`,
  (name: string) => `A perfect dinner of ${name.toLowerCase()}.`,
  (name: string) => `Savor the flavors of ${name.toLowerCase()}.`,
  (name: string) => `Comforting ${name.toLowerCase()} to close your day.`,
];

const snackDescriptions = [
  (name: string) => `Tasty ${name.toLowerCase()} for a quick energy boost.`,
  (name: string) => `Perfect ${name.toLowerCase()} to curb your cravings.`,
  (name: string) => `Grab this ${name.toLowerCase()} for a quick pick-me-up.`,
  (name: string) => `Enjoy ${name.toLowerCase()} between meals.`,
  (name: string) => `Smart snacking with ${name.toLowerCase()}.`,
  (name: string) => `Quick bite of ${name.toLowerCase()}.`,
  (name: string) => `Satisfy your hunger with ${name.toLowerCase()}.`,
  (name: string) => `Light and tasty ${name.toLowerCase()}.`,
  (name: string) => `Perfect treat: ${name.toLowerCase()}.`,
  (name: string) => `Keep going with ${name.toLowerCase()}.`,
  (name: string) => `Guilt-free ${name.toLowerCase()} snack.`,
  (name: string) => `A delightful ${name.toLowerCase()} to munch on.`,
];

const getRandomDescription = (
  descriptions: ((name: string) => string)[],
  name: string
): string => {
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex](name);
};

type FoodFilters = {
  highProtein?: boolean;
  highCarbs?: boolean;
  highFat?: boolean;
  highCal?: boolean;
};

type UseFoodRecommendationsOptions = {
  autoFetch?: boolean;
  filters?: FoodFilters;
};

type GroupedRecommendations = {
  breakfast: FoodRecommendation[];
  lunch: FoodRecommendation[];
  dinner: FoodRecommendation[];
  snacks: FoodRecommendation[];
};

type UseFoodRecommendationsReturn = {
  recommendations: FoodRecommendation[];
  groupedRecommendations: GroupedRecommendations;
  mealDistribution: MealDistribution | null;
  loading: boolean;
  error: string | null;
  refetch: (customFilters?: FoodFilters) => Promise<void>;
  hasData: boolean;
  appliedFilters: FoodFilters;
};

const transformApiResponse = (
  payload: FoodRecommendationsResponse
): {
  grouped: GroupedRecommendations;
  flat: FoodRecommendation[];
  distribution: MealDistribution | null;
} => {
  const grouped: GroupedRecommendations = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };

  const flat: FoodRecommendation[] = [];

  // Transform breakfast items
  payload.recommendations.breakfast.forEach((item, idx) => {
    const foodItem: FoodRecommendation = {
      id: `breakfast-${idx}`,
      name: item.name,
      description: getRandomDescription(breakfastDescriptions, item.name),
      mealTime: "breakfast",
      servingSize: item.servingSize,
      calories: item.calories,
      carbs: item.carbs,
      protein: item.protein,
      fat: item.fat,
    };
    grouped.breakfast.push(foodItem);
    flat.push(foodItem);
  });

  // Transform lunch items
  payload.recommendations.lunch.forEach((item, idx) => {
    const foodItem: FoodRecommendation = {
      id: `lunch-${idx}`,
      name: item.name,
      description: getRandomDescription(lunchDescriptions, item.name),
      mealTime: "lunch",
      servingSize: item.servingSize,
      calories: item.calories,
      carbs: item.carbs,
      protein: item.protein,
      fat: item.fat,
    };
    grouped.lunch.push(foodItem);
    flat.push(foodItem);
  });

  // Transform dinner items
  payload.recommendations.dinner.forEach((item, idx) => {
    const foodItem: FoodRecommendation = {
      id: `dinner-${idx}`,
      name: item.name,
      description: getRandomDescription(dinnerDescriptions, item.name),
      mealTime: "dinner",
      servingSize: item.servingSize,
      calories: item.calories,
      carbs: item.carbs,
      protein: item.protein,
      fat: item.fat,
    };
    grouped.dinner.push(foodItem);
    flat.push(foodItem);
  });

  // Transform snacks items
  payload.recommendations.snacks.forEach((item, idx) => {
    const foodItem: FoodRecommendation = {
      id: `snacks-${idx}`,
      name: item.name,
      description: getRandomDescription(snackDescriptions, item.name),
      mealTime: "snack",
      servingSize: item.servingSize,
      calories: item.calories,
      carbs: item.carbs,
      protein: item.protein,
      fat: item.fat,
    };
    grouped.snacks.push(foodItem);
    flat.push(foodItem);
  });

  return {
    grouped,
    flat,
    distribution: payload.mealDistribution,
  };
};

export const useFoodRecommendations = (
  options: UseFoodRecommendationsOptions = { autoFetch: true, filters: {} }
): UseFoodRecommendationsReturn => {
  const { autoFetch = true, filters: initialFilters = {} } = options;
  const [recommendations, setRecommendations] = useState<FoodRecommendation[]>(
    []
  );
  const [groupedRecommendations, setGroupedRecommendations] =
    useState<GroupedRecommendations>({
      breakfast: [],
      lunch: [],
      dinner: [],
      snacks: [],
    });
  const [mealDistribution, setMealDistribution] =
    useState<MealDistribution | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] =
    useState<FoodFilters>(initialFilters);

  const fetchRecommendations = useCallback(
    async (customFilters?: FoodFilters) => {
      setLoading(true);
      setError(null);

      const filtersToApply = customFilters ?? appliedFilters;
      setAppliedFilters(filtersToApply);

      try {
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (filtersToApply.highProtein)
          queryParams.append("highProtein", "true");
        if (filtersToApply.highCarbs) queryParams.append("highCarbs", "true");
        if (filtersToApply.highFat) queryParams.append("highFat", "true");
        if (filtersToApply.highCal) queryParams.append("highCal", "true");

        const url = `${BACKEND_URL}/account/recommend-foods${
          queryParams.toString() ? `?${queryParams.toString()}` : ""
        }`;

        const response = await fetch(url, {
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            errorText || "We couldn't load food recommendations right now."
          );
        }

        const data = (await response.json()) as FoodRecommendationsResponse;

        console.log(data);
        const { grouped, flat, distribution } = transformApiResponse(data);

        // Set data even if empty - UI will handle empty state
        setRecommendations(flat);
        setGroupedRecommendations(grouped);
        setMealDistribution(distribution);
      } catch (err) {
        console.error("Failed to fetch food recommendations:", err);
        setError(
          err instanceof Error
            ? err.message
            : "We couldn't load food recommendations right now."
        );
        // Clear data on error
        setRecommendations([]);
        setGroupedRecommendations({
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: [],
        });
        setMealDistribution(null);
      } finally {
        setLoading(false);
      }
    },
    [appliedFilters]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [autoFetch]);

  const hasData = useMemo(
    () => recommendations != null && recommendations.length > 0,
    [recommendations]
  );

  return {
    recommendations,
    groupedRecommendations,
    mealDistribution,
    loading,
    error,
    refetch: fetchRecommendations,
    hasData,
    appliedFilters,
  };
};
