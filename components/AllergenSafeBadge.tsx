import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type AllergenSafeBadgeProps = {
  variant?: "minimal" | "prominent";
};

export default function AllergenSafeBadge({
  variant = "minimal",
}: AllergenSafeBadgeProps) {
  if (variant === "minimal") {
    return (
      <View
        style={styles.minimalBadge}
        accessibilityLabel="No allergens detected"
      >
        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        <Text style={styles.minimalText}>Safe</Text>
      </View>
    );
  }

  return (
    <View
      style={styles.prominentBadge}
      accessibilityLabel="No allergens detected in this food"
    >
      <Ionicons name="shield-checkmark" size={20} color="#10B981" />
      <Text style={styles.prominentText}>✓ No Allergens Detected</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  minimalBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  minimalText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#059669",
    fontFamily: "PoppinsSemiBold",
  },
  prominentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#10B981",
    marginBottom: 16,
  },
  prominentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
    fontFamily: "PoppinsSemiBold",
  },
});
