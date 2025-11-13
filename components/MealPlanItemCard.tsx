import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { FoodRecommendation } from "@/constants/foodRecommendations";
import { colors } from "@/lib/utils";
import { getMealIconConfig } from "@/utils/mealIcons";
import { Ionicons } from "@expo/vector-icons";

type MealPlanItemCardProps = {
  item: FoodRecommendation;
};

function MealPlanItemCardComponent({ item }: MealPlanItemCardProps) {
  const iconConfig = getMealIconConfig(item.mealTime);

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: iconConfig.backgroundColor },
        ]}
      >
        <Ionicons
          name={iconConfig.name as keyof typeof Ionicons.glyphMap}
          size={24}
          color={iconConfig.color}
        />
      </View>

      <View style={styles.details}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>

        {(item.calories || item.prepTime) && (
          <View style={styles.metaRow}>
            {item.calories ? (
              <Text style={styles.metaText}>{item.calories} kcal</Text>
            ) : null}
            {item.prepTime ? (
              <View style={styles.dot} accessibilityElementsHidden>
                <Text style={styles.dotText}>•</Text>
              </View>
            ) : null}
            {item.prepTime ? (
              <Text style={styles.metaText}>{item.prepTime}</Text>
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    shadowColor: "#1F2933",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 16,
    color: colors.black,
  },
  description: {
    fontFamily: "Poppins",
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 12,
    color: "#4B5563",
  },
  dot: {
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});

const MealPlanItemCard = memo(MealPlanItemCardComponent);

export default MealPlanItemCard;

