import { colors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type GuideSection = {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  content: string;
  steps?: string[];
};

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "1",
    title: "Getting Started with NutriSight",
    icon: "rocket-outline",
    content:
      "Welcome to NutriSight! This guide will help you understand how to make the most of your nutrition tracking journey. NutriSight uses advanced AI to analyze your meals and provide detailed nutritional insights.",
    steps: [
      "Complete your profile setup with accurate health information",
      "Set your dietary goals and target weight",
      "Add any food allergens you may have",
      "Start tracking your first meal!",
    ],
  },
  {
    id: "2",
    title: "Tracking Your Meals",
    icon: "camera-outline",
    content:
      "NutriSight makes meal tracking effortless with AI-powered food recognition.",
    steps: [
      "Tap the camera icon on your home screen",
      "Take a clear photo of your meal from above",
      "Wait for AI analysis to identify food items",
      "Review and adjust portions if needed",
      "Save to your daily log",
    ],
  },
  {
    id: "3",
    title: "Understanding Your Macros",
    icon: "pie-chart-outline",
    content:
      "Macronutrients (macros) are the building blocks of your diet: proteins, carbohydrates, and fats.",
    steps: [
      "Proteins: Essential for muscle growth and repair",
      "Carbs: Your body's primary energy source",
      "Fats: Important for hormone production and vitamin absorption",
      "Track your daily intake on the Home screen",
      "View detailed breakdowns by tapping each macro card",
    ],
  },
  {
    id: "4",
    title: "Setting & Achieving Goals",
    icon: "trophy-outline",
    content:
      "Set personalized nutrition targets based on your health objectives.",
    steps: [
      "Go to Settings > Dietary Goals",
      "Choose your primary goal (weight loss, maintenance, or gain)",
      "Adjust daily calorie and macro targets",
      "Monitor your progress in the Progress tab",
      "Update goals as you achieve milestones",
    ],
  },
  {
    id: "5",
    title: "Viewing Nutrient Summaries",
    icon: "stats-chart-outline",
    content:
      "Get comprehensive insights into your nutritional intake and progress over time.",
    steps: [
      "Navigate to the Progress tab",
      "View daily summaries",
      "Check your weight tracking chart",
    ],
  },
  {
    id: "6",
    title: "Managing Food Allergens",
    icon: "warning-outline",
    content:
      "Stay safe by marking your food allergens and getting instant alerts.",
    steps: [
      "Go to Settings > Allergens",
      "Select all relevant allergens from the list",
      "NutriSight will flag potential allergens in scanned meals",
      "Review allergen warnings before consuming food",
      "Update your allergen list anytime",
    ],
  },
  {
    id: "7",
    title: "Using the Barcode Scanner",
    icon: "barcode-outline",
    content: "Quickly log packaged foods by scanning their barcodes.",
    steps: [
      "Tap the barcode icon in the camera screen",
      "Align the barcode within the frame",
      "NutriSight will fetch nutrition information",
      "Adjust serving size if needed",
      "Add to your meal log",
    ],
  },
  {
    id: "8",
    title: "Manual Food Entry",
    icon: "create-outline",
    content: "Can't scan? No problem! Manually enter food items with ease.",
    steps: [
      "Tap 'Add Food' from the home screen",
      "Search for food items in our database or from a external API",
      "Enter quantity and serving size",
      "Save to your daily log",
    ],
  },
];

function UserGuide() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredSections = GUIDE_SECTIONS.filter(
    (section) =>
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>User Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Introduction */}
        <View style={styles.introContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="book-outline" size={32} color={colors.primary} />
          </View>
          <Text style={styles.introTitle}>Welcome to NutriSight 👋</Text>
          <Text style={styles.introText}>
            Your comprehensive guide to tracking nutrition, achieving health
            goals, and living a balanced lifestyle. Explore the sections below
            to learn how to use all features effectively.
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#9CA3AF"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search guide topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Guide Sections */}
        <View style={styles.sectionsContainer}>
          {filteredSections.length > 0 ? (
            filteredSections.map((section) => (
              <GuideItem
                key={section.id}
                section={section}
                isExpanded={expandedId === section.id}
                onToggle={() => handleToggle(section.id)}
              />
            ))
          ) : (
            <View style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching with different keywords
              </Text>
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <View style={styles.helpCard}>
            <View style={styles.helpHeader}>
              <View style={styles.helpIconCircle}>
                <Ionicons name="help-circle" size={28} color="#F59E0B" />
              </View>
              <Text style={styles.helpTitle}>Need More Help?</Text>
            </View>
            <Text style={styles.helpText}>
              Can't find what you're looking for? Our support team is here to
              assist you with any questions about using NutriSight.
            </Text>
            <View style={styles.helpDivider} />
            <TouchableOpacity
              style={styles.helpButton}
              onPress={() => {
                // Navigate to support or open email
                router.back();
              }}
            >
              <Ionicons name="mail" size={16} color="white" />
              <Text style={styles.helpButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default memo(UserGuide);

// Guide Item Component
const GuideItem = ({
  section,
  isExpanded,
  onToggle,
}: {
  section: GuideSection;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <View style={styles.guideItem}>
      <TouchableOpacity
        style={styles.guideHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.guideHeaderLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name={section.icon} size={24} color={colors.primary} />
          </View>
          <Text style={styles.guideTitle}>{section.title}</Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#9CA3AF"
        />
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.guideContent}>
          <Text style={styles.guideDescription}>{section.content}</Text>
          {section.steps && section.steps.length > 0 && (
            <View style={styles.stepsContainer}>
              {section.steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  introContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(45, 54, 68, 0.08)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  introTitle: {
    fontSize: 22,
    fontFamily: "PoppinsSemiBold",
    color: colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  introText: {
    fontSize: 15,
    fontFamily: "Poppins",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  searchContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Poppins",
    color: "#111827",
    paddingVertical: 14,
  },
  clearButton: {
    padding: 4,
  },
  sectionsContainer: {
    marginBottom: 20,
  },
  guideItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  guideHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  guideHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(45, 54, 68, 0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  guideTitle: {
    fontSize: 16,
    fontFamily: "PoppinsMedium",
    color: colors.primary,
    flex: 1,
  },
  guideContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  guideDescription: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 16,
  },
  stepsContainer: {
    marginTop: 8,
  },
  stepItem: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
    color: "white",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#374151",
    lineHeight: 22,
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: "PoppinsSemiBold",
    color: "#6B7280",
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#9CA3AF",
    marginTop: 8,
  },
  helpSection: {
    marginTop: 12,
  },
  helpCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#FDE68A",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  helpHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  helpIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  helpTitle: {
    fontSize: 20,
    fontFamily: "PoppinsSemiBold",
    color: "#92400E",
    flex: 1,
  },
  helpText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#78350F",
    lineHeight: 22,
    marginBottom: 16,
  },
  helpDivider: {
    height: 1,
    backgroundColor: "#FDE68A",
    marginBottom: 16,
  },
  helpPoints: {
    gap: 12,
    marginBottom: 20,
  },
  helpPoint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  helpPointText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#78350F",
    lineHeight: 20,
  },
  helpButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButtonText: {
    fontSize: 15,
    fontFamily: "PoppinsSemiBold",
    color: "white",
  },
});
