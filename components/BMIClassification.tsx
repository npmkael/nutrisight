import { LinearGradient } from "expo-linear-gradient";
import React, { memo, useMemo } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import InfoTooltip from "./InfoTooltip";
import Typo from "./Typo";

const BMI_CATEGORIES = [
  { label: "Underweight", color: "#4F8CFF", min: 0, max: 18.49 },
  { label: "Normal", color: "#7ED957", min: 18.5, max: 24.99 },
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

function BMIClassification({ bmi, name, onLogWeight }: BMIClassificationProps) {
  const category = useMemo(() => getClassification(bmi), [bmi]);

  // Calculate marker position based on actual BMI category distributions
  // The gradient represents: Underweight (0-18.49), Normal (18.5-24.99), Overweight (25-29.99), Obese (30+)
  let markerPos = 0;

  if (bmi <= 18.49) {
    // Underweight: 0-18.49 (about 46% of the 0-40 range)
    markerPos = (bmi / 18.49) * 0.46;
  } else if (bmi <= 24.99) {
    // Normal: 18.5-24.99 (about 16% of the 0-40 range)
    markerPos = 0.46 + ((bmi - 18.5) / (24.99 - 18.5)) * 0.16;
  } else if (bmi <= 29.99) {
    // Overweight: 25-29.99 (about 12% of the 0-40 range)
    markerPos = 0.62 + ((bmi - 25) / (29.99 - 25)) * 0.12;
  } else {
    // Obese: 30+ (about 26% of the 0-40 range)
    markerPos = 0.74 + Math.min((bmi - 30) / 10, 1) * 0.26;
  }

  markerPos = useMemo(() => Math.min(Math.max(markerPos, 0), 1), [markerPos]);

  return (
    <>
      <View className="flex-row justify-between items-center mt-6 mb-2 mx-4">
        <Typo size={18} className="font-PoppinsSemiBold">
          BMI Weight Classification
        </Typo>
        <InfoTooltip
          title="BMI Weight Classification"
          content="BMI (Body Mass Index) is calculated using your height and weight (BMI = weight ÷ height²). The colored bar shows different weight categories: Blue = Underweight (BMI < 18.5), Green = Normal (18.5-24.9), Yellow = Overweight (25-29.9), Red = Obese (BMI ≥ 30). Your current position is marked on the scale. Use 'LOG WEIGHT' to update your BMI."
        />
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
        <View className="relative h-8 mb-4 mt-10">
          {/* Color bar */}
          <LinearGradient
            colors={["#487DE7", "#79C314", "#FAEB36", "#FFA500", "#E81416"]}
            style={styles.linearGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          {/* BMI Marker */}
          <View
            style={{
              position: "absolute",
              left: `${markerPos * 100}%`,
              top: -38,
              transform: [{ translateX: -38 }],
              width: 50,
              height: 50,
            }}
          >
            {/* Marker Background */}
            <Image
              source={require("../assets/icons/marker.png")}
              style={{
                width: 50,
                height: 50,
                resizeMode: "contain",
              }}
            />
            {/* Profile Image Overlay */}
            {/* */}
            <Image
              source={
                true
                  ? require("@/assets/images/sample-profile.jpg")
                  : require("@/assets/images/default-profile.jpg")
              }
              style={{
                position: "absolute",
                top: 8,
                left: 15,
                width: 20,
                height: 20,
                borderRadius: 17,
                borderWidth: 2,
                borderColor: "#fff",
              }}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </View>
        </View>
        {/* Legend */}
        <View className="flex-row mb-8">
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
          <View className="w-full h-[1px] bg-gray-200 rounded-full" />

          <View className="flex-row justify-between items-center">
            <Text className="font-Poppins text-gray-400 text-sm">
              Weight Classification per BMI
            </Text>
            <Text className="font-PoppinsSemiBold text-sm">
              {category.label}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
}

export default memo(BMIClassification);

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
