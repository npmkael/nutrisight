import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FoodRecommendation } from "@/constants/foodRecommendations";
import { colors } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { getMealIconConfig } from "@/utils/mealIcons";
import { Ionicons } from "@expo/vector-icons";

type MealPlanItemCardProps = {
  item: FoodRecommendation;
};

function MealPlanItemCardComponent({ item }: MealPlanItemCardProps) {
  const iconConfig = getMealIconConfig(item.mealTime);

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconOuterRing,
            { borderColor: iconConfig.color + "20" },
          ]}
        />
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: iconConfig.backgroundColor },
          ]}
        >
          <Ionicons
            name={iconConfig.name as keyof typeof Ionicons.glyphMap}
            size={24}
            color={iconConfig.color}
          />
        </View>
      </View>

      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>
          {capitalizeFirstLetter(item.name)}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        {item.servingSize && (
          <Text style={styles.servingSize}>{item.servingSize}</Text>
        )}

        <View style={styles.metaRow}>
          {item.calories && (
            <View style={[styles.metaBadge, styles.caloriesBadge]}>
              <Ionicons name="flame-outline" size={14} color="#F59E0B" />
              <Text style={styles.metaText}>{item.calories}</Text>
            </View>
          )}
          {item.protein && (
            <View style={[styles.metaBadge, styles.proteinBadge]}>
              <Text style={[styles.metaLabel, styles.proteinLabel]}>P:</Text>
              <Text style={styles.metaText}>{item.protein}</Text>
            </View>
          )}
          {item.carbs && (
            <View style={[styles.metaBadge, styles.carbsBadge]}>
              <Text style={[styles.metaLabel, styles.carbsLabel]}>C:</Text>
              <Text style={styles.metaText}>{item.carbs}</Text>
            </View>
          )}
          {item.fat && (
            <View style={[styles.metaBadge, styles.fatBadge]}>
              <Text style={[styles.metaLabel, styles.fatLabel]}>F:</Text>
              <Text style={styles.metaText}>{item.fat}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.03)",
  },
  iconContainer: {
    position: "relative",
    width: 52,
    height: 52,
    minWidth: 52,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  iconOuterRing: {
    position: "absolute",
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 2,
    opacity: 0.3,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 17,
    lineHeight: 22,
    color: colors.black,
    letterSpacing: -0.2,
  },
  description: {
    fontFamily: "Poppins",
    fontSize: 13,
    lineHeight: 19,
    color: "#6B7280",
  },
  servingSize: {
    fontFamily: "PoppinsMedium",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  caloriesBadge: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  proteinBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  carbsBadge: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    borderColor: "rgba(249, 115, 22, 0.2)",
  },
  fatBadge: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  metaLabel: {
    fontFamily: "PoppinsBold",
    fontSize: 11,
    color: "#6B7280",
    letterSpacing: 0.2,
  },
  proteinLabel: {
    color: "#10B981",
  },
  carbsLabel: {
    color: "#F97316",
  },
  fatLabel: {
    color: "#3B82F6",
  },
  metaText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 11,
    color: "#374151",
  },
});

const MealPlanItemCard = memo(MealPlanItemCardComponent);

export default MealPlanItemCard;
