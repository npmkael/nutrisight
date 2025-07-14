import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const BMI_CATEGORIES = [
  { label: "Underweight", color: "#4F8CFF", min: 0, max: 18.49 },
  { label: "Normal Weight", color: "#7ED957", min: 18.5, max: 24.99 },
  { label: "Overweight", color: "#FFD600", min: 25, max: 29.99 },
  { label: "Obese", color: "#FF4B4B", min: 30, max: 100 },
];

function getClassification(bmi: number) {
  for (const cat of BMI_CATEGORIES) {
    if (bmi >= cat.min && bmi <= cat.max) return cat;
  }
  return BMI_CATEGORIES[0];
}

interface BMIClassificationProps {
  bmi: number;
  name?: string;
  onLogWeight: () => void;
}

export default function BMIClassification({
  bmi,
  name,
  onLogWeight,
}: BMIClassificationProps) {
  const category = getClassification(bmi);

  // Calculate marker position (0-1)
  const minBMI = BMI_CATEGORIES[0].min;
  const maxBMI = BMI_CATEGORIES[BMI_CATEGORIES.length - 1].max;
  const markerPos = Math.min(
    Math.max((bmi - minBMI) / (maxBMI - minBMI), 0),
    1
  );

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          BMI Weight Classification
        </Typo>
        <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
      </View>
      <View className="bg-white rounded-2xl shadow-xl p-4">
        <View className="items-end mb-2">
          <TouchableOpacity
            className="px-5 py-2 bg-gray-700 rounded-full shadow"
            onPress={onLogWeight}
          >
            <Text className="text-white font-PoppinsSemiBold tracking-widest text-xs">
              LOG WEIGHT
            </Text>
          </TouchableOpacity>
        </View>
        {/* BMI Bar */}
        <View className="relative h-8 mb-4 mt-2">
          {/* Color bar */}
          <LinearGradient
            colors={["#487DE7", "#79C314", "#FAEB36", "#FFA500", "#E81416"]}
            style={styles.linearGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          {/* Marker */}
          {/* <View
          style={{ left: `${markerPos * 100}%` }}
          className="absolute -top-3 z-10"
        >
          <View className="items-center">
            <View className="bg-blue-800 rounded-full border-2 border-white w-8 h-8 items-center justify-center shadow-lg">
              <Text className="text-white font-bold">R</Text>
            </View>
            <View className="w-2 h-2 bg-blue-800 rounded-full mt-[-4px]" />
          </View>
        </View> */}
        </View>
        {/* Legend */}
        <View className="flex-row justify-between mb-8">
          {BMI_CATEGORIES.map((cat) => (
            <View
              key={cat.label}
              className="flex-row gap-1 items-center justify-center flex-1"
            >
              <View
                style={{ backgroundColor: cat.color }}
                className="w-2 h-2 rounded-sm"
              />
              <View>
                <Text className="text-xs text-gray-400 font-Poppins">
                  {cat.label}
                </Text>
                <Text className="text-xs font-PoppinsSemiBold">
                  {cat.min} - {cat.max}
                </Text>
              </View>
            </View>
          ))}
        </View>
        {/* BMI Value and Classification */}
        <View className="flex-col gap-2">
          <View className="flex-row justify-between items-center">
            <Text className="font-Poppins text-gray-400">Current BMI</Text>
            <Text className="font-PoppinsSemiBold">{bmi}</Text>
          </View>

          <View className="w-full h-[1px] bg-gray-200 rounded-full" />

          <View className="flex-row justify-between items-center">
            <Text className="font-Poppins text-gray-400">
              Weight Classification per BMI
            </Text>
            <Text className="font-PoppinsSemiBold">Normal Weight</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 12,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
    elevation: 2,
  },
});
