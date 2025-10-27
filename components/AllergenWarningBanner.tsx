import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AllergenWarningBannerProps = {
  triggeredAllergens: { ingredient: string; allergen: string }[];
  onViewAlternatives?: () => void;
  onReportIncorrect?: () => void;
  severity?: "critical" | "moderate";
};

export default function AllergenWarningBanner({
  triggeredAllergens,
  onViewAlternatives,
  onReportIncorrect,
  severity = "critical",
}: AllergenWarningBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Get unique allergen names
  const uniqueAllergens = Array.from(
    new Set(triggeredAllergens.map((t) => t.allergen.toLowerCase()))
  ).map((allergen) => capitalizeFirstLetter(allergen));

  // Determine colors based on severity
  const colors = {
    critical: {
      bg: "#DC2626",
      bgLight: "#FEE2E2",
      border: "#991B1B",
      text: "#FFFFFF",
      tagBg: "#991B1B",
    },
    moderate: {
      bg: "#F59E0B",
      bgLight: "#FEF3C7",
      border: "#D97706",
      text: "#FFFFFF",
      tagBg: "#D97706",
    },
  };

  const colorScheme = colors[severity];

  // Show first 2-3 allergens, then "+ X more"
  const displayAllergens =
    uniqueAllergens.length <= 3 ? uniqueAllergens : uniqueAllergens.slice(0, 2);
  const remainingCount = uniqueAllergens.length - displayAllergens.length;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  if (triggeredAllergens.length === 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colorScheme.bg,
          borderColor: colorScheme.border,
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={`Warning: This food contains ${uniqueAllergens.join(", ")}`}
    >
      {/* Main Warning Header */}
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.8}
        style={styles.headerContainer}
      >
        <View style={styles.headerContent}>
          <MaterialIcons
            name="warning"
            size={24}
            color={colorScheme.text}
            style={styles.icon}
          />
          <View style={styles.textContainer}>
            <Text style={[styles.warningTitle, { color: colorScheme.text }]}>
              {severity === "critical"
                ? "SEVERE ALLERGEN WARNING"
                : "ALLERGEN NOTICE"}
            </Text>
            <Text style={[styles.allergenList, { color: colorScheme.text }]}>
              Contains: {displayAllergens.join(", ")}
              {remainingCount > 0 && ` +${remainingCount} more`}
            </Text>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={colorScheme.text}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Details */}
      {isExpanded && (
        <View
          style={[
            styles.expandedContent,
            { backgroundColor: colorScheme.bgLight },
          ]}
        >
          {/* Full Allergen List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detected Allergens:</Text>
            <View style={styles.tagContainer}>
              {uniqueAllergens.map((allergen, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.allergenTag,
                    { backgroundColor: colorScheme.tagBg },
                  ]}
                >
                  <Text style={styles.allergenTagText}>{allergen}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Detailed Ingredients Breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specific Ingredients:</Text>
            {triggeredAllergens.slice(0, 5).map((trigger, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <View style={styles.bulletPoint} />
                <Text style={styles.ingredientText}>
                  <Text style={styles.ingredientName}>
                    {capitalizeFirstLetter(trigger.ingredient)}
                  </Text>
                  {" → "}
                  <Text style={styles.allergenName}>
                    {capitalizeFirstLetter(trigger.allergen)}
                  </Text>
                </Text>
              </View>
            ))}
            {triggeredAllergens.length > 5 && (
              <Text style={styles.moreText}>
                ...and {triggeredAllergens.length - 5} more ingredients
              </Text>
            )}
          </View>

          {/* Warning Message */}
          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={18} color="#DC2626" />
            <Text style={styles.warningMessage}>
              Please read all labels carefully and consult with a healthcare
              provider if you have any concerns about allergen exposure.
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContainer: {
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PoppinsBold",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  allergenList: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
  },
  expandedContent: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
    color: "#374151",
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergenTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  allergenTagText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
    gap: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#DC2626",
    marginTop: 6,
  },
  ingredientText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#1F2937",
  },
  ingredientName: {
    fontWeight: "600",
    color: "#374151",
  },
  allergenName: {
    fontWeight: "700",
    color: "#DC2626",
  },
  moreText: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#6B7280",
    marginTop: 4,
    fontFamily: "Poppins",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
    marginBottom: 16,
  },
  warningMessage: {
    flex: 1,
    fontSize: 12,
    color: "#374151",
    fontFamily: "Poppins",
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F3F4F6",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryButtonText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
  },
});
