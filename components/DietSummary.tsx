import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

import { PieChart } from "react-native-gifted-charts";

export default function DietSummary() {
  const [activeTab, setActiveTab] = useState<"calories" | "nutrients">(
    "calories"
  );

  const data = [
    { value: 35.76, color: "#061A40" },
    { value: 25.6, color: "#0353A4" },
    { value: 19.75, color: "#B9D6F2" },
    { value: 12.85, color: "#003559" },
    { value: 6.31, color: "#006DAA" },
  ];

  const caloriesSumarryData = [
    {
      name: "Lunch",
      value: 35.76,
      calories: 240,
      color: "#061A40",
    },
    {
      name: "Dinner",
      value: 25.6,
      calories: 170,
      color: "#0353A4",
    },
    {
      name: "Breakfast",
      value: 19.75,
      calories: 120,
      color: "#B9D6F2",
    },
    {
      name: "Snack",
      value: 12.85,
      calories: 100,
      color: "#003559",
    },
    {
      name: "Other",
      value: 6.31,
      calories: 80,
      color: "#006DAA",
    },
  ];

  const nutrientsSumarryData = [
    {
      name: "Carbs",
      value: 124,
      color: "#3EC6E0",
    },
    {
      name: "Protein",
      value: 124,
      color: "#3EC6E0",
    },
    {
      name: "Fiber",
      value: 124,
      color: "#3EC6E0",
    },
  ];

  const nutrientsSumarryData2 = [
    {
      name: "Calcium",
      value: 124,
      color: "#3EC6E0",
    },
    {
      name: "Iron",
      value: 124,
      color: "#3EC6E0",
    },
    {
      name: "Fat",
      value: 124,
      color: "#3EC6E0",
    },
  ];

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          Diet Summary
        </Typo>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
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
            <View className="flex-row justify-evenly items-center mb-4">
              <PieChart data={data} donut innerRadius={10} radius={80} />

              <View className="flex-col gap-2">
                {caloriesSumarryData.map((data) => (
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
                        {data.value}% ({data.calories} cal)
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
              Total Nutrients (570 cal)
            </Typo>

            <View className="flex-row gap-4 mb-4">
              {nutrientsSumarryData.map((data) => (
                <Nutrient key={data.name} {...data} />
              ))}
            </View>

            <View className="flex-row gap-4">
              {nutrientsSumarryData2.map((data) => (
                <Nutrient key={data.name} {...data} />
              ))}
            </View>
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
