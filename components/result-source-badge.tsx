import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { memo, useCallback, useState } from "react";
import {
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SourceType = "api" | "ai" | "community" | "manual" | "estimated";

type SourceConfig = {
  type: SourceType;
  displayName: string;
  icon: keyof typeof Ionicons.glyphMap;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  trustLevel: "high" | "medium" | "low";
  description: string;
  reliability: string;
};

const sourceConfigs: Record<string, SourceConfig> = {
  usda: {
    type: "api",
    displayName: "USDA Database",
    icon: "shield-checkmark",
    backgroundColor: "#3B82F6",
    textColor: "#FFFFFF",
    borderColor: "#2563EB",
    trustLevel: "high",
    description: "U.S. Department of Agriculture National Nutrient Database",
    reliability: "Official government nutritional database with verified data",
  },
  nutritionix: {
    type: "api",
    displayName: "Nutritionix API",
    icon: "shield-checkmark",
    backgroundColor: "#10B981",
    textColor: "#FFFFFF",
    borderColor: "#059669",
    trustLevel: "high",
    description:
      "Professional nutritional database with restaurant and branded foods",
    reliability: "Verified database with extensive food coverage",
  },
  mynetdiary: {
    type: "api",
    displayName: "MyNetDiary",
    icon: "shield-checkmark",
    backgroundColor: "#14B8A6",
    textColor: "#FFFFFF",
    borderColor: "#0D9488",
    trustLevel: "high",
    description: "Comprehensive food and nutrition tracking database",
    reliability: "Trusted nutritional data source",
  },
  "open food facts": {
    type: "community",
    displayName: "Open Food Facts",
    icon: "people",
    backgroundColor: "#F59E0B",
    textColor: "#FFFFFF",
    borderColor: "#D97706",
    trustLevel: "medium",
    description: "Community-driven open database of food products worldwide",
    reliability: "Crowdsourced data with community verification",
  },
  book: {
    type: "api",
    displayName: "FNRI Database",
    icon: "book",
    backgroundColor: "#FBBF24",
    textColor: "#000000",
    borderColor: "#F59E0B",
    trustLevel: "high",
    description: "Food and Nutrition Research Institute database",
    reliability: "Official nutritional data from FNRI",
  },
  gemini: {
    type: "ai",
    displayName: "AI Analysis",
    icon: "flash",
    backgroundColor: "#8B5CF6",
    textColor: "#FFFFFF",
    borderColor: "#7C3AED",
    trustLevel: "medium",
    description:
      "AI-powered nutritional analysis using advanced image recognition",
    reliability: "Estimated values based on visual analysis",
  },
  manual: {
    type: "manual",
    displayName: "Manual Entry",
    icon: "pencil",
    backgroundColor: "#6B7280",
    textColor: "#FFFFFF",
    borderColor: "#4B5563",
    trustLevel: "low",
    description: "User-entered nutritional information",
    reliability: "Data accuracy depends on user input",
  },
  estimated: {
    type: "estimated",
    displayName: "Estimated",
    icon: "calculator",
    backgroundColor: "#F59E0B",
    textColor: "#FFFFFF",
    borderColor: "#D97706",
    trustLevel: "low",
    description: "Calculated nutritional estimates",
    reliability: "Approximate values based on similar foods",
  },
};

type ResultSourceBadgeProps = {
  source: string;
  compact?: boolean;
  showTooltip?: boolean;
  confidenceScore?: number;
  lastUpdated?: string;
};

function ResultSourceBadge({
  source,
  compact = false,
  showTooltip = true,
  confidenceScore,
  lastUpdated,
}: ResultSourceBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(600));

  const sourceKey = source.toLowerCase();
  const config = sourceConfigs[sourceKey] || {
    type: "manual" as SourceType,
    displayName: capitalizeFirstLetter(source),
    icon: "information-circle" as const,
    backgroundColor: "#9CA3AF",
    textColor: "#FFFFFF",
    borderColor: "#6B7280",
    trustLevel: "low" as const,
    description: "Unknown data source",
    reliability: "Source information not available",
  };

  const handlePress = useCallback(() => {
    setShowModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  }, [slideAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: 600,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowModal(false);
    });
  }, [slideAnim]);

  const renderIcon = () => {
    const iconSize = compact ? 14 : 16;
    const iconColor = config.textColor;

    return <Ionicons name={config.icon} size={iconSize} color={iconColor} />;
  };

  const getTrustIndicator = () => {
    switch (config.trustLevel) {
      case "high":
        return (
          <Ionicons
            name="checkmark-circle"
            size={12}
            color={config.textColor}
            style={styles.trustIcon}
          />
        );
      case "medium":
        return (
          <Ionicons
            name="information-circle"
            size={12}
            color={config.textColor}
            style={styles.trustIcon}
          />
        );
      case "low":
        return (
          <MaterialIcons
            name="warning"
            size={12}
            color={config.textColor}
            style={styles.trustIcon}
          />
        );
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={showTooltip ? handlePress : undefined}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        accessibilityLabel={`Data source: ${config.displayName}`}
        accessibilityRole="button"
        accessibilityHint="Tap to view detailed source information"
      >
        <Animated.View
          style={[
            compact ? styles.compactBadge : styles.badge,
            {
              backgroundColor: config.backgroundColor,
              borderColor: config.borderColor,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.badgeContent}>
            {renderIcon()}
            {!compact && (
              <>
                <Text
                  style={[styles.badgeText, { color: config.textColor }]}
                  numberOfLines={1}
                >
                  {config.displayName}
                </Text>
                {getTrustIndicator()}
              </>
            )}
          </View>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  compactBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 6,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
    letterSpacing: 0.3,
  },
  trustIcon: {
    marginLeft: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  modalDragHandle: {
    alignItems: "center",
    paddingVertical: 12,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  modalScrollView: {
    flex: 1,
  },
  modalContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  modalHeader: {
    marginBottom: 24,
  },
  modalTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  modalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitleContainer: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PoppinsBold",
    color: "#111827",
    marginBottom: 8,
  },
  sourceTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sourceTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  sourceTypeText: {
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "PoppinsBold",
    letterSpacing: 0.5,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
  },
  trustText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
    color: "#374151",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 21,
  },
  confidenceBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  confidenceFill: {
    height: "100%",
    borderRadius: 4,
  },
  confidenceText: {
    fontSize: 13,
    fontFamily: "PoppinsSemiBold",
    color: "#374151",
  },
  attributionText: {
    fontSize: 13,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 20,
  },
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#9CA3AF",
    marginTop: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Poppins",
    color: "#6B7280",
    lineHeight: 18,
  },
});

export default memo(ResultSourceBadge);
