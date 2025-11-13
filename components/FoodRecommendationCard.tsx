import { memo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { FoodRecommendation } from "@/constants/foodRecommendations";
import { colors } from "@/lib/utils";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { getMealIconConfig } from "@/utils/mealIcons";
import { Ionicons } from "@expo/vector-icons";

type FoodRecommendationCardProps = {
  recommendation?: FoodRecommendation | null;
  isLoading?: boolean;
  error?: string | null;
  onPress?: () => void;
  accentLabel?: string;
  buttonLabel?: string;
};

function FoodRecommendationCardComponent({
  recommendation,
  isLoading = false,
  error,
  onPress,
  accentLabel = "Today's pick",
  buttonLabel = "See all recommendations",
}: FoodRecommendationCardProps) {
  const iconConfig = getMealIconConfig(recommendation?.mealTime);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.95, transform: [{ scale: 0.985 }] },
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      {/* Header section with label and badge */}
      <View style={styles.header}>
        <View style={styles.accentLabelWrapper}>
          <Ionicons name="sparkles" size={14} color="#30B0C7" />
          <Text style={styles.accentLabel}>{accentLabel}</Text>
        </View>
      </View>

      {/* Main content section */}
      <View style={styles.content}>
        {/* Enhanced icon with layered background */}
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
              {
                backgroundColor: iconConfig.backgroundColor,
              },
            ]}
          >
            <Ionicons
              name={iconConfig.name as keyof typeof Ionicons.glyphMap}
              size={32}
              color={iconConfig.color}
            />
          </View>
        </View>

        {/* Text content */}
        <View style={styles.details}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.loadingText}>Loading delicious ideas…</Text>
            </View>
          ) : error ? (
            <View style={styles.errorState}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : recommendation ? (
            <>
              <Text style={styles.title} numberOfLines={1}>
                {capitalizeFirstLetter(recommendation.name)}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {recommendation.description}
              </Text>
              {/* Serving size */}
              {recommendation.servingSize && (
                <Text style={styles.servingSize}>
                  {recommendation.servingSize}
                </Text>
              )}
              {/* Macros row */}
              <View style={styles.metaRow}>
                {recommendation.calories && (
                  <View style={[styles.metaItem, styles.caloriesItem]}>
                    <Ionicons name="flame-outline" size={14} color="#F59E0B" />
                    <Text style={styles.metaText}>
                      {recommendation.calories}
                    </Text>
                  </View>
                )}
                {recommendation.protein && (
                  <View style={[styles.metaItem, styles.proteinItem]}>
                    <Text style={[styles.metaLabel, styles.proteinLabel]}>
                      P:
                    </Text>
                    <Text style={styles.metaText}>
                      {recommendation.protein}
                    </Text>
                  </View>
                )}
                {recommendation.carbs && (
                  <View style={[styles.metaItem, styles.carbsItem]}>
                    <Text style={[styles.metaLabel, styles.carbsLabel]}>
                      C:
                    </Text>
                    <Text style={styles.metaText}>{recommendation.carbs}</Text>
                  </View>
                )}
                {recommendation.fat && (
                  <View style={[styles.metaItem, styles.fatItem]}>
                    <Text style={[styles.metaLabel, styles.fatLabel]}>F:</Text>
                    <Text style={styles.metaText}>{recommendation.fat}</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>No recommendations available</Text>
              <Text style={styles.description} numberOfLines={2}>
                Check back later for personalized meal suggestions.
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Enhanced button with hover effect */}
      <View style={styles.footer}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>{buttonLabel}</Text>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Main card container with premium elevation
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.04)",
  },
  accentLine: {
    height: 4,
    backgroundColor: "#2D3644",
    opacity: 0.85,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  accentLabelWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  accentLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    color: "#30B0C7",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(48, 176, 199, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(48, 176, 199, 0.2)",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#30B0C7",
  },
  badgeText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 11,
    color: "#30B0C7",
  },
  content: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  iconContainer: {
    position: "relative",
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
  },
  iconOuterRing: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 20,
    borderWidth: 2,
    opacity: 0.3,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  details: {
    flex: 1,
    gap: 6,
    paddingTop: 2,
  },
  title: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 19,
    lineHeight: 24,
    color: colors.black,
    letterSpacing: -0.3,
  },
  description: {
    fontFamily: "Poppins",
    fontSize: 13,
    lineHeight: 20,
    color: "#6B7280",
    letterSpacing: 0.1,
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
    marginTop: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
  },
  caloriesItem: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
  },
  proteinItem: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  carbsItem: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(249, 115, 22, 0.2)",
  },
  fatItem: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
  },
  metaLabel: {
    fontFamily: "PoppinsBold",
    fontSize: 11,
    color: "#6B7280",
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
    color: "#4B5563",
  },

  // Loading state
  loadingState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  loadingText: {
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#4B5563",
  },

  // Error state with icon
  errorState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  errorText: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#DC2626",
    lineHeight: 18,
  },

  // Subtle divider before footer
  divider: {
    height: 1,
    backgroundColor: "rgba(0, 0, 0, 0.06)",
    marginHorizontal: 20,
  },

  // Footer section
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  // Enhanced button design
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.primary,
    // Enhanced button shadow
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 4,
  },
  buttonText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 14,
    color: colors.white,
    letterSpacing: 0.3,
  },
  // Arrow in circular container
  arrowCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
});

const FoodRecommendationCard = memo(FoodRecommendationCardComponent);

export default FoodRecommendationCard;
