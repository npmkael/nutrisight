import { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import InfoTooltip from "./InfoTooltip";
import Typo from "./Typo";

import { UserType } from "@/context/AuthContext";
import { getCaloriesFromMealEntry } from "@/utils/helpers";
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
  const nutrientSummary: {
    name: string;
    value: number;
    color: string;
    unit?: string;
  }[] = rawNutrientSummary
    .map((n: any) => {
      const name = String(n.name || n.label || "").trim();
      const key = name.toLowerCase();
      const value = Number(n.value ?? n.amount ?? 0);
      const color = NUTRIENT_COLOR_MAP[key] ?? "#0369A1"; // default color
      return { name, value, color, unit: n.unit };
    })
    .filter((n) => !n.name.includes(":"));

  // Split nutrientSummary into two rows for display
  const nutrientSummary2d: {
    name: string;
    value: number;
    color: string;
    unit?: string;
  }[][] = [];
  for (let i = 0; i < nutrientSummary.length; i += 3) {
    nutrientSummary2d.push(nutrientSummary.slice(i, i + 3));
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
                        {data.value.toFixed(2)}% ({data.calories} cal)
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View className="flex-col">
            <Typo
              size={14}
              className="font-Poppins  mb-2 text-gray-300"
              color="#000000"
            >
              Total Nutrients ({totalLoggedCalories} kcal)
            </Typo>

            {nutrientSummary2d.map((row, rowIdx) => (
              <View key={rowIdx} className="flex-row gap-4 mb-4">
                {row.map((data) => (
                  <Nutrient key={data.name} {...data} />
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </>
  );
}

const Nutrient = ({
  name,
  value,
  color,
}: {
  name: string;
  value: number;
  color: string;
}) => {
  return (
    <View className="bg-gray-100 rounded-xl px-6 py-4 items-center flex-1">
      <Text className="font-PoppinsSemiBold tracking-widest text-sm uppercase mb-1">
        {name}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: 80,
          marginBottom: 8,
        }}
      >
        <View
          style={{
            height: 2,
            width: 32,
            backgroundColor: color,
            borderRadius: 1,
          }}
        />
        <View
          style={{
            flex: 1,
            height: 2,
            backgroundColor: "#d1d5db",
            marginLeft: 0,
          }}
        />
      </View>
      <Text className="flex-row items-end">
        <Text className="text-xl font-PoppinsSemiBold">{value}</Text>
        <Text className="text-xs font-Poppins ml-1 self-end">g</Text>
      </Text>
    </View>
  );
};
