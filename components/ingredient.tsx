import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IngredientProps {
  name: string;
  allergen?: string[];
  onDelete: () => void;
  barcode?: boolean;
}

export const Ingredient = ({
  name,
  allergen,
  onDelete,
  barcode,
}: IngredientProps) => {
  const hasAllergen = allergen && allergen.length > 0;

  return (
    <View
      style={[styles.container, hasAllergen && styles.containerWithAllergen]}
    >
      <View style={styles.contentContainer}>
        {/* Ingredient Name */}
        <View style={styles.nameRow}>
          <Text style={styles.ingredientName}>
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </Text>
          {!barcode && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Allergen Badges */}
        {hasAllergen && (
          <View style={styles.allergenContainer}>
            <View style={styles.allergenWarningRow}>
              <MaterialIcons
                name="warning"
                size={14}
                color="#DC2626"
                style={styles.warningIcon}
              />
              <Text style={styles.allergenLabel}>Contains allergen:</Text>
            </View>
            <View style={styles.allergenBadges}>
              {allergen.map((a, idx) => (
                <View key={idx} style={styles.allergenBadge}>
                  <Text style={styles.allergenText}>
                    {capitalizeFirstLetter(a)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  containerWithAllergen: {
    borderColor: "#FCA5A5",
    borderWidth: 2,
    backgroundColor: "#FEF2F2",
  },
  contentContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
    color: "#111827",
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  allergenContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#FCA5A5",
  },
  allergenWarningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  warningIcon: {
    marginRight: 4,
  },
  allergenLabel: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "PoppinsMedium",
    color: "#DC2626",
  },
  allergenBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  allergenBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 4,
  },
  allergenText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "PoppinsSemiBold",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
