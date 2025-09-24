import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const macronutrients = [
  {
    id: "calories",
    title: "Calories",
    value: "1,918",
    unit: "kcal",
    target: "2,000",
    percentage: 96,
    icon: (
      <Image
        source={require("@/assets/icons/calories.png")}
        style={{ width: 28, height: 28 }}
      />
    ),
    route: "/(root)/(settings)/(edit)/edit-calories",
  },
  {
    id: "protein",
    title: "Protein",
    value: "45",
    unit: "g",
    target: "60",
    percentage: 75,
    icon: (
      <Image
        source={require("@/assets/icons/protein.png")}
        style={{ width: 28, height: 28 }}
      />
    ),
    route: "/(root)/(settings)/(edit)/edit-protein",
  },
  {
    id: "carbs",
    title: "Carbohydrates",
    value: "180",
    unit: "g",
    target: "250",
    percentage: 72,
    icon: (
      <Image
        source={require("@/assets/icons/carbs.png")}
        style={{ width: 28, height: 28 }}
      />
    ),
    route: "/(root)/(settings)/(edit)/edit-carbs",
  },
  {
    id: "fats",
    title: "Fats",
    value: "42",
    unit: "g",
    target: "67",
    percentage: 63,
    icon: (
      <Image
        source={require("@/assets/icons/fats.png")}
        style={{ width: 28, height: 28 }}
      />
    ),
    route: "/(root)/(settings)/(edit)/edit-fats",
  },
];

const MacroCard = ({ macro }: { macro: (typeof macronutrients)[0] }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.macroCard}
      onPress={() => router.push(macro.route as any)}
      activeOpacity={0.7}
    >
      {/* Header with icon and title */}
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View className="bg-gray-100 rounded-2xl p-4">{macro.icon}</View>
          <Text style={styles.macroTitle}>{macro.title}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
      </View>

      {/* Main content */}
      <View style={styles.cardContent}>
        {/* Current value */}
        <View style={styles.valueSection}>
          <View style={styles.currentValueContainer}>
            <Text style={styles.currentValue}>{macro.value}</Text>
            <Text style={styles.currentUnit}>{macro.unit}</Text>
          </View>
          <Text style={styles.valueLabel}>consumed</Text>
        </View>

        {/* Target and progress */}
        <View style={styles.targetSection}>
          <View style={styles.targetHeader}>
            <Text style={styles.targetLabel}>Target</Text>
            <Text style={styles.targetValue}>
              {macro.target}
              {macro.unit}
            </Text>
          </View>

          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(100, macro.percentage)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.percentageText}>{macro.percentage}%</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MacroCard;

const styles = StyleSheet.create({
  macroList: {
    marginBottom: 32,
  },
  macroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F9FAFB",
  },

  // Card Header Styles
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  macroTitle: {
    fontSize: 16,
    fontFamily: "PoppinsSemiBold",
    color: "#111827",
    letterSpacing: -0.2,
  },

  // Card Content Styles
  cardContent: {
    gap: 20,
  },

  // Value Section
  valueSection: {
    alignItems: "flex-start",
  },
  currentValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  currentValue: {
    fontSize: 36,
    fontFamily: "PoppinsBold",
    color: "#111827",
    letterSpacing: -1,
    lineHeight: 40,
  },
  currentUnit: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
  },
  valueLabel: {
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Target Section
  targetSection: {
    gap: 12,
  },
  targetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  targetLabel: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  targetValue: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    color: "#374151",
  },

  // Progress Styles
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981", // Single accent color - emerald
    borderRadius: 2,
  },
  percentageText: {
    fontSize: 12,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
    minWidth: 32,
    textAlign: "right",
  },
});
