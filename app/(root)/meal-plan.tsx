import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MealPlanItemCard from "@/components/MealPlanItemCard";
import { useFoodRecommendations } from "@/hooks/useFoodRecommendations";
import { colors } from "@/lib/utils";
import { getRandomItems } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type SectionKey = "breakfast" | "lunch" | "dinner" | "snacks";

const sectionsConfig: Array<{
  key: SectionKey;
  title: string;
  percentageKey: keyof import("@/constants/foodRecommendations").MealDistribution;
}> = [
  { key: "breakfast", title: "Breakfast", percentageKey: "breakfast" },
  { key: "lunch", title: "Lunch", percentageKey: "lunch" },
  { key: "dinner", title: "Dinner", percentageKey: "dinner" },
  { key: "snacks", title: "Snacks", percentageKey: "snacks" },
];

export default function MealPlanScreen() {
  const [filters, setFilters] = useState({
    highProtein: false,
    highCarbs: false,
    highFat: false,
    highCal: false,
  });

  const { groupedRecommendations, mealDistribution, loading, error, refetch } =
    useFoodRecommendations();

  const toggleFilter = (filterKey: keyof typeof filters) => {
    const newFilters = { ...filters, [filterKey]: !filters[filterKey] };
    setFilters(newFilters);
    refetch(newFilters);
  };

  const groupedSections = useMemo(() => {
    return sectionsConfig.map((section) => ({
      ...section,
      items: getRandomItems(groupedRecommendations[section.key] ?? [], 3),
      percentage: mealDistribution?.[section.percentageKey],
    }));
  }, [groupedRecommendations, mealDistribution]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.black} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Daily meal plan</Text>
          <Text style={styles.headerSubtitle}>
            Curated meals to keep you nourished.
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refetch} />
        }
      >
        {/* Filter Section */}
        <View style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterLabel}>Filters:</Text>
            <View style={styles.scrollHint}>
              <Text style={styles.scrollHintText}>Swipe</Text>
              <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.highProtein && styles.filterChipActive,
              ]}
              onPress={() => toggleFilter("highProtein")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.highProtein && styles.filterChipTextActive,
                ]}
              >
                High Protein
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.highCarbs && styles.filterChipActive,
              ]}
              onPress={() => toggleFilter("highCarbs")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.highCarbs && styles.filterChipTextActive,
                ]}
              >
                High Carbs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.highFat && styles.filterChipActive,
              ]}
              onPress={() => toggleFilter("highFat")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.highFat && styles.filterChipTextActive,
                ]}
              >
                High Fat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterChip,
                filters.highCal && styles.filterChipActive,
              ]}
              onPress={() => toggleFilter("highCal")}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filters.highCal && styles.filterChipTextActive,
                ]}
              >
                High Calorie
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={18} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {groupedSections.map((section) => (
          <View key={section.key} style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.percentage && (
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>
                      {section.percentage}
                    </Text>
                  </View>
                )}
              </View>
              <View style={styles.sectionDivider} />
            </View>

            {section.items.length ? (
              section.items.map((item, idx) => (
                <View
                  key={`${section.key}-${item.id ?? idx}`}
                  style={styles.itemSpacing}
                >
                  <MealPlanItemCard item={item} />
                </View>
              ))
            ) : loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>
                  Gathering fresh recommendations…
                </Text>
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={20} color="#9CA3AF" />
                <Text style={styles.emptyText}>
                  No {section.title.toLowerCase()} recommendations available.
                </Text>
              </View>
            )}
          </View>
        ))}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F7",
  },
  header: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1F2933",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 20,
    color: colors.black,
    textTransform: "capitalize",
  },
  headerSubtitle: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(220, 38, 38, 0.08)",
  },
  errorText: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#B91C1C",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 28,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 20,
    color: colors.black,
    letterSpacing: -0.3,
  },
  percentageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: "rgba(48, 176, 199, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(48, 176, 199, 0.25)",
  },
  percentageText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#30B0C7",
    letterSpacing: 0.2,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
    marginLeft: 16,
  },
  loadingWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  loadingText: {
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#4B5563",
  },
  itemSpacing: {
    marginBottom: 12,
  },
  emptyState: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "rgba(156, 163, 175, 0.08)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(156, 163, 175, 0.15)",
    borderStyle: "dashed",
  },
  emptyText: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 32,
  },
  filterSection: {
    paddingVertical: 12,
    backgroundColor: "#F3F4F7",
  },
  filterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  filterLabel: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: colors.black,
  },
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    opacity: 0.6,
  },
  scrollHintText: {
    fontFamily: "Poppins",
    fontSize: 11,
    color: "#9CA3AF",
  },
  filterScrollContent: {
    gap: 8,
    paddingHorizontal: 20,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    shadowOpacity: 0.15,
    shadowColor: colors.primary,
    shadowRadius: 8,
    elevation: 4,
  },
  filterChipText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 13,
    color: "#4B5563",
  },
  filterChipTextActive: {
    color: colors.white,
  },
});
