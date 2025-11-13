import { useCallback, useEffect, useMemo, useState } from "react";

import {
  FoodRecommendation,
  FoodRecommendationsResponse,
  MealDistribution,
} from "@/constants/foodRecommendations";
import { BACKEND_URL } from "@/context/AuthContext";

type UseFoodRecommendationsOptions = {
  autoFetch?: boolean;
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
  refetch: () => Promise<void>;
  hasData: boolean;
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
  payload.recommendations.breakfast.forEach((name, idx) => {
    const item: FoodRecommendation = {
      id: `breakfast-${idx}`,
      name,
      description: `Delicious ${name.toLowerCase()} to start your day right.`,
      mealTime: "breakfast",
    };
    grouped.breakfast.push(item);
    flat.push(item);
  });

  // Transform lunch items
  payload.recommendations.lunch.forEach((name, idx) => {
    const item: FoodRecommendation = {
      id: `lunch-${idx}`,
      name,
      description: `Nutritious ${name.toLowerCase()} to fuel your afternoon.`,
      mealTime: "lunch",
    };
    grouped.lunch.push(item);
    flat.push(item);
  });

  // Transform dinner items
  payload.recommendations.dinner.forEach((name, idx) => {
    const item: FoodRecommendation = {
      id: `dinner-${idx}`,
      name,
      description: `Satisfying ${name.toLowerCase()} to end your day well.`,
      mealTime: "dinner",
    };
    grouped.dinner.push(item);
    flat.push(item);
  });

  // Transform snacks items
  payload.recommendations.snacks.forEach((name, idx) => {
    const item: FoodRecommendation = {
      id: `snacks-${idx}`,
      name,
      description: `Tasty ${name.toLowerCase()} for a quick energy boost.`,
      mealTime: "snack",
    };
    grouped.snacks.push(item);
    flat.push(item);
  });

  return {
    grouped,
    flat,
    distribution: payload.mealDistribution,
  };
};

export const useFoodRecommendations = (
  options: UseFoodRecommendationsOptions = { autoFetch: true }
): UseFoodRecommendationsReturn => {
  const { autoFetch = true } = options;
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

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BACKEND_URL}/account/recommend-foods`, {
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
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchRecommendations();
    }
  }, [autoFetch, fetchRecommendations]);

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
  };
};
