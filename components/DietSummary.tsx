import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import InfoTooltip from "./InfoTooltip";
import Typo from "./Typo";

import { UserType } from "@/context/AuthContext";
import {
  getCaloriesFromMealEntry,
  setPrecisionIfNotInteger,
} from "@/utils/helpers";
import { PieChart } from "react-native-gifted-charts";

export default function DietSummary({
  user,
  totalCalories,
}: {
  totalCalories: number;
  user: UserType;
}) {
  const [activeTab, setActiveTab] = useState<"calories" | "nutrients">(
    "calories"
  );

  const now = useMemo(() => new Date(), []);
  const dietHistory = useMemo(() => {
    return (
      user?.dietHistory?.find((h) => {
        const historyDate = new Date(h.date);
        return (
          historyDate.getFullYear() === now.getFullYear() &&
          historyDate.getMonth() === now.getMonth() &&
          historyDate.getDate() === now.getDate()
        );
      }) || undefined
    );
  }, [user?.dietHistory]);

  // Helper to sum calories for a meal array
  const sumMealCalories = (meals?: { calorie?: number }[]) =>
    meals?.reduce((sum, meal) => sum + Number(meal.calorie || 0), 0);

  // Get calories for each meal from dietHistory
  const breakfastCalories =
    sumMealCalories(
      (dietHistory?.breakfast ?? []).map((b) => ({
        calorie: getCaloriesFromMealEntry(b),
      }))
    ) || 0;
  const lunchCalories =
    sumMealCalories(
      (dietHistory?.lunch ?? []).map((l) => ({
        calorie: getCaloriesFromMealEntry(l),
      }))
    ) || 0;
  const dinnerCalories =
    sumMealCalories(
      (dietHistory?.dinner ?? []).map((d) => ({
        calorie: getCaloriesFromMealEntry(d),
      }))
    ) || 0;
  const otherCalories =
    sumMealCalories(
      (dietHistory?.otherMealTime ?? []).map((o) => ({
        calorie: getCaloriesFromMealEntry(o),
      }))
    ) || 0;

  // Calculate percentages
  const totalLoggedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + otherCalories;

  const pieData = [
    {
      name: "Breakfast",
      value: totalCalories > 0 ? (breakfastCalories / totalCalories) * 100 : 0,
      calories: breakfastCalories,
      color: "#B9D6F2",
    },
    {
      name: "Lunch",
      value: totalCalories > 0 ? (lunchCalories / totalCalories) * 100 : 0,
      calories: lunchCalories,
      color: "#061A40",
    },
    {
      name: "Dinner",
      value: totalCalories > 0 ? (dinnerCalories / totalCalories) * 100 : 0,
      calories: dinnerCalories,
      color: "#0353A4",
    },
    {
      name: "Snacks",
      value: totalCalories > 0 ? (otherCalories / totalCalories) * 100 : 0,
      calories: otherCalories,
      color: "#003559",
    },
  ];

  const breakfastNutrientSummary =
    dietHistory?.breakfast
      .map((meal) => meal.nutritionData.map((cat) => cat.items).flat())
      .flat() || [];
  const lunchNutrientSummary =
    dietHistory?.lunch
      .map((meal) => meal.nutritionData.map((cat) => cat.items).flat())
      .flat() || [];
  const dinnerNutrientSummary =
    dietHistory?.dinner
      .map((meal) => meal.nutritionData.map((cat) => cat.items).flat())
      .flat() || [];
  const otherNutrientSummary =
    dietHistory?.otherMealTime
      .map((meal) => meal.nutritionData.map((cat) => cat.items).flat())
      .flat() || [];

  const rawNutrientSummary = [
    ...breakfastNutrientSummary,
    ...lunchNutrientSummary,
    ...dinnerNutrientSummary,
    ...otherNutrientSummary,
  ];

  // Simple color map for common nutrients — extend as needed
  const NUTRIENT_COLOR_MAP: Record<string, string> = {
    calories: "#FFB703",
    protein: "#4CC9F0",
    carbs: "#90E0EF",
    fat: "#F94144",
    fiber: "#8ECAE6",
    sugar: "#F8961E",
  };

  // Normalize items to include color and ensure numeric value
  // Helper to sum all keys that include a keyword
  const sumByKeyword = (obj: Record<string, number>, keyword: string) =>
    Object.entries(obj)
      .filter(([key]) => key.toLowerCase().includes(keyword))
      .reduce((sum, [, value]) => sum + Number(value || 0), 0);

  // Build a totals object keyed by normalized lower-case name to aggregate duplicates
  const totalsByName: Record<
    string,
    { name: string; value: number; unit: string }
  > = {};

  rawNutrientSummary
    .map((n: any) => {
      const name = String(n.name || n.label || "").trim();
      const key = name.toLowerCase();
      const value = Number(n.value ?? n.amount ?? 0);
      const unit = n.unit;
      return { name, key, value, unit };
    })
    .filter((n) => n.name && !n.name.includes(":"))
    .forEach((n) => {
      if (!totalsByName[n.key]) {
        totalsByName[n.key] = { name: n.name, value: 0, unit: n.unit };
      }
      totalsByName[n.key].value += n.value;
      if (!totalsByName[n.key].unit && n.unit)
        totalsByName[n.key].unit = n.unit;
    });

  // Build a de-duplicated nutrient summary array
  const nutrientSummary: {
    name: string;
    value: number;
    color: string;
    unit: string;
  }[] = Object.entries(totalsByName).map(([key, v]) => {
    {
      console.log("Nutrient:", v);
      return {
        name: v.name,
        value: v.value,
        color: NUTRIENT_COLOR_MAP[key] ?? "#0369A1",
        unit: v.unit,
      };
    }
  });

  // Now ensure macronutrients are summed by keyword (covers slight name variations)
  const macronutrientNames = [
    "protein",
    "carbs",
    "carbohydrate",
    "fat",
    "fiber",
    "sugar",
    "total fat",
    "total carbohydrate",
  ];

  // Create a simple map of name->value for keyword summing
  const simpleTotalsMap: Record<string, number> = {};
  nutrientSummary.forEach((n) => {
    simpleTotalsMap[n.name.toLowerCase()] =
      (simpleTotalsMap[n.name.toLowerCase()] || 0) + Number(n.value || 0);
  });

  // Separate macronutrients and micronutrients
  const macronutrients = nutrientSummary.filter((n) =>
    macronutrientNames.some((macro) =>
      n.name.toLowerCase().includes(macro.toLowerCase())
    )
  );

  const micronutrients = nutrientSummary.filter(
    (n) =>
      !macronutrientNames.some((macro) =>
        n.name.toLowerCase().includes(macro.toLowerCase())
      )
  );

  // Split macronutrients into rows of 3 for display
  const macronutrients2d: {
    name: string;
    value: number;
    color: string;
    unit: string;
  }[][] = [];
  for (let i = 0; i < macronutrients.length; i += 3) {
    macronutrients2d.push(macronutrients.slice(i, i + 3));
  }

  // Split micronutrients into rows of 3 for display
  const micronutrients2d: {
    name: string;
    value: number;
    color: string;
    unit?: string;
  }[][] = [];
  for (let i = 0; i < micronutrients.length; i += 3) {
    micronutrients2d.push(micronutrients.slice(i, i + 3));
  }

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          Diet Summary
        </Typo>
        <InfoTooltip
          title="Diet Summary"
          content="This section shows your daily food intake breakdown. The 'Calories Summary' tab displays a pie chart showing what percentage of calories came from each meal (Breakfast, Lunch, Dinner, Snacks). The 'Nutrients Summary' tab shows the total amount of different nutrients you consumed today, helping you track your nutritional balance."
        />
      </View>

      {/* Content Area */}
      <View className="bg-white rounded-2xl shadow-xl p-4">
        {/* Tab Navigation */}
        <View className="mx-4 mb-4">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setActiveTab("calories")}
              className="flex-1"
            >
              <View className="items-center pb-2">
                <Typo
                  size={14}
                  color={activeTab === "calories" ? "#374151" : "#9CA3AF"}
                  className="font-Poppins"
                >
                  Calories Summary
                </Typo>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("nutrients")}
              className="flex-1"
            >
              <View className="items-center pb-2">
                <Typo
                  size={14}
                  color={activeTab === "nutrients" ? "#374151" : "#9CA3AF"}
                  className="font-Poppins"
                >
                  Nutrients Summary
                </Typo>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tab Indicator */}
          <View className="flex-row">
            <View
              className={`h-[1.5px] ${activeTab === "calories" ? "bg-gray-700" : "bg-gray-300"} flex-1`}
            />
            <View
              className={`h-[1.5px] ${activeTab === "nutrients" ? "bg-gray-700" : "bg-gray-300"} flex-1`}
            />
          </View>
        </View>

        {activeTab === "calories" ? (
          <>
            <View className="flex-row justify-evenly items-center">
              <PieChart data={pieData} donut innerRadius={10} radius={80} />

              <View className="flex-col gap-2">
                {pieData.map((data) => (
                  <View key={data.name} className="flex-row gap-2">
                    <View
                      className="w-2.5 h-2.5 mt-1.5"
                      style={{ backgroundColor: data.color }}
                    />
                    <View className="flex-col gap-[1px]">
                      <Text className="font-Poppins text-sm text-gray-400">
                        {data.name}
                      </Text>

                      <View className="w-full h-[1px] bg-gray-200" />

                      <Text className=" text-sm font-semibold">
                        {setPrecisionIfNotInteger(data.value)}% ({data.calories}{" "}
                        cal)
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View className="flex-col">
            {/* Macronutrients Section */}
            {macronutrients.length > 0 && (
              <>
                <Text
                  className=" mb-2 text-md"
                  style={{ fontFamily: "GeistSemiBold" }}
                >
                  Macronutrients
                </Text>
                {macronutrients.map((data, idx) => (
                  <NutrientListItem
                    key={data.name}
                    {...data}
                    isLast={idx === macronutrients.length - 1}
                  />
                ))}
              </>
            )}

            {/* Other Nutrients Section */}
            {micronutrients.length > 0 && (
              <>
                <Text
                  className=" mb-2 mt-4 text-md"
                  style={{ fontFamily: "GeistSemiBold" }}
                >
                  Other Nutrients
                </Text>
                {micronutrients.map((data, idx) => (
                  <NutrientListItem
                    key={data.name}
                    {...data}
                    isLast={idx === micronutrients.length - 1}
                  />
                ))}
              </>
            )}

            {/* Empty state */}
            {macronutrients.length === 0 && micronutrients.length === 0 && (
              <Typo
                size={14}
                className="font-Poppins text-center text-gray-400 py-4"
              >
                No nutrient data available
              </Typo>
            )}
          </View>
        )}
      </View>
    </>
  );
}

const NutrientListItem = ({
  name,
  value,
  color,
  unit,
  isLast,
}: {
  name: string;
  value: number;
  color: string;
  unit?: string;
  isLast?: boolean;
}) => {
  return (
    <View
      className={`flex-row justify-between items-center py-3 ${!isLast ? "border-b border-gray-200" : ""}`}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <Text
          className="text-sm capitalize"
          style={{ fontFamily: "GeistMedium" }}
        >
          {name}
        </Text>
      </View>
      <Text className="flex-row items-end">
        <Text className="text-base" style={{ fontFamily: "GeistSemiBold" }}>
          {setPrecisionIfNotInteger(value)}
        </Text>
        <Text className="text-sm  ml-1" style={{ fontFamily: "GeistMedium" }}>
          {unit ||
            `${
              name.toLowerCase() === "calorie" ||
              name.toLowerCase() === "energy"
                ? " kcal"
                : " g"
            }`}
        </Text>
      </Text>
    </View>
  );
};
