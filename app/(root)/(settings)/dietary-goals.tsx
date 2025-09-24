import MacroCard, { macronutrients } from "@/components/MacroCard";
import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Mock data - replace with actual user data from context/API

function DietaryGoals() {
  const router = useRouter();

  const back = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={back}>
            <Ionicons name="arrow-back" size={20} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Dietary Goals</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Additional Info */}
        <Animated.View
          entering={FadeIn.duration(600).delay(600)}
          className="bg-blue-50 p-4 rounded-2xl mb-8"
        >
          <View className="flex-row items-center mb-2">
            <Ionicons name="information-circle" size={20} color="#3B82F6" />
            <Text className="text-sm font-PoppinsSemiBold text-blue-900 ml-2">
              Your Nutrition Targets
            </Text>
          </View>
          <Text className="text-sm font-Poppins text-blue-800 leading-5">
            Tap on any macronutrient below to adjust your daily targets. These
            goals help you maintain a balanced diet and achieve your health
            objectives.
          </Text>
        </Animated.View>

        {/* Macronutrients List */}
        <View style={styles.macroList}>
          <Text style={styles.sectionTitle}>Macronutrient Goals</Text>
          {macronutrients.map((macro) => (
            <MacroCard key={macro.id} macro={macro} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default memo(DietaryGoals);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    textAlign: "center",
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
    zIndex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 20,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
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

  // Summary Header
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
    color: "#111827",
    letterSpacing: -0.2,
  },
  summaryBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  summaryBadgeText: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#10B981",
  },

  // Summary Grid
  summaryGrid: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 24,
  },
  summaryItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  summaryValue: {
    fontSize: 28,
    fontFamily: "PoppinsBold",
    color: "#111827",
    letterSpacing: -0.5,
    lineHeight: 48,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: "PoppinsSemiBold",
    color: "#374151",
    marginBottom: 2,
  },
  summarySubtext: {
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#9CA3AF",
  },

  // Summary Progress
  summaryProgress: {
    gap: 8,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    fontFamily: "PoppinsMedium",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: "PoppinsSemiBold",
    color: "#10B981",
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 16,
  },
  macroList: {
    marginBottom: 32,
  },
});
