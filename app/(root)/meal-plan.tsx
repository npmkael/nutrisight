import { useMemo } from "react";
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
  const { groupedRecommendations, mealDistribution, loading, error, refetch } =
    useFoodRecommendations();

  const groupedSections = useMemo(() => {
    return sectionsConfig.map((section) => ({
      ...section,
      items: groupedRecommendations[section.key] ?? [],
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

      {error ? (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={18} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
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

            {loading && !section.items.length ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.loadingText}>
                  Gathering fresh recommendations…
                </Text>
              </View>
            ) : section.items.length ? (
              section.items.map((item, idx) => (
                <View
                  key={`${section.key}-${item.id ?? idx}`}
                  style={styles.itemSpacing}
                >
                  <MealPlanItemCard item={item} />
                </View>
              ))
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
    marginBottom: 8,
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
    gap: 24,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 18,
    color: colors.black,
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(48, 176, 199, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(48, 176, 199, 0.2)",
  },
  percentageText: {
    fontFamily: "PoppinsSemiBold",
    fontSize: 12,
    color: "#30B0C7",
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
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: "#1F2933",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
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
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "rgba(156, 163, 175, 0.12)",
    borderRadius: 14,
  },
  emptyText: {
    flex: 1,
    fontFamily: "Poppins",
    fontSize: 13,
    color: "#6B7280",
  },
  bottomSpacing: {
    height: 32,
  },
});
