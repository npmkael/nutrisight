import { commonAllergens, otherAllergens } from "@/utils/globalVars";
import { Allergen } from "@/utils/types";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AllergensSelectionProps {
  selectedAllergens: string[];
  setSelectedAllergens: React.Dispatch<React.SetStateAction<string[]>>;
}

function AllergensSelection({
  selectedAllergens,
  setSelectedAllergens,
}: AllergensSelectionProps) {
  const [customAllergen, setCustomAllergen] = useState("");
  const [customAllergens, setCustomAllergens] = useState<string[]>([]);

  // Extract custom allergens from selectedAllergens on mount and when it changes
  useEffect(() => {
    const customs = selectedAllergens
      .filter((allergen) => allergen.startsWith("custom_"))
      .map((allergen) => {
        // Convert "custom_shellfish" back to "Shellfish"
        const name = allergen.replace("custom_", "").replace(/_/g, " ");
        return name.charAt(0).toUpperCase() + name.slice(1);
      });
    setCustomAllergens(customs);
  }, [selectedAllergens]);

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergens((prev: string[]) => {
      if (allergenId === "none") {
        return ["none"];
      }
      if (prev.includes(allergenId)) {
        return prev.filter((id: string) => id !== allergenId);
      } else {
        // Remove "none" if selecting other allergens
        const filtered = prev.filter((id: string) => id !== "none");
        return [...filtered, allergenId];
      }
    });
  };

  const addCustomAllergen = () => {
    const trimmedAllergen = customAllergen.trim();

    if (!trimmedAllergen) {
      Alert.alert("Error", "Please enter an allergen name");
      return;
    }

    // Check if allergen already exists in predefined lists
    const allPredefinedAllergens = [...commonAllergens, ...otherAllergens];
    const isDuplicate = allPredefinedAllergens.some(
      (allergen) =>
        allergen.name.toLowerCase() === trimmedAllergen.toLowerCase()
    );

    if (isDuplicate) {
      Alert.alert("Error", "This allergen is already in the list");
      return;
    }

    // Check if custom allergen already added
    if (
      customAllergens.some(
        (a) => a.toLowerCase() === trimmedAllergen.toLowerCase()
      )
    ) {
      Alert.alert("Error", "You've already added this custom allergen");
      return;
    }

    const customId = `custom_${trimmedAllergen.toLowerCase().replace(/\s+/g, "_")}`;

    // Add to selected allergens (don't update customAllergens directly - it will be updated via useEffect)
    setSelectedAllergens((prev) => {
      const filtered = prev.filter((id: string) => id !== "none");
      return [...filtered, customId];
    });

    // Clear input
    setCustomAllergen("");
  };

  const removeCustomAllergen = (allergenName: string) => {
    // Remove from selected allergens (customAllergens will be updated via useEffect)
    setSelectedAllergens((prev) =>
      prev.filter(
        (id) =>
          id !== `custom_${allergenName.toLowerCase().replace(/\s+/g, "_")}`
      )
    );
  };

  const renderAllergenButton = (allergen: Allergen) => {
    const isSelected = selectedAllergens.includes(allergen.id);

    return (
      <TouchableOpacity
        key={allergen.id}
        className={`py-3 px-4 rounded-lg border mb-2 ${
          isSelected
            ? "bg-[#2D3644] border-[#2D3644]"
            : "bg-white border-gray-300"
        }`}
        onPress={() => toggleAllergen(allergen.id)}
      >
        <Text
          className={`text-center font-PoppinsMedium text-base ${
            isSelected ? "text-white" : "text-black"
          }`}
        >
          {allergen.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* No Allergies Section */}
          <View className="mb-6">
            <Text className="font-PoppinsSemiBold text-lg text-black mb-3">
              No allergies or intolerances
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {otherAllergens
                .filter((allergen) => allergen.id === "none")
                .map(renderAllergenButton)}
            </View>
          </View>

          {/* Add Custom Allergen Section */}
          <View className="mb-6">
            <Text className="font-PoppinsSemiBold text-lg text-black mb-3">
              Add custom allergen
            </Text>
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 bg-white font-PoppinsMedium text-base"
                placeholder="Enter allergen name..."
                placeholderTextColor="#999"
                value={customAllergen}
                onChangeText={setCustomAllergen}
                onSubmitEditing={addCustomAllergen}
                returnKeyType="done"
              />
              <TouchableOpacity
                className="bg-[#2D3644] py-3 px-6 rounded-lg justify-center items-center"
                onPress={addCustomAllergen}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Custom Allergens Display */}
          {customAllergens.length > 0 && (
            <View className="mb-6">
              <Text className="font-PoppinsSemiBold text-lg text-black mb-3">
                Your custom allergens
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {customAllergens.map((allergenName) => (
                  <View
                    key={allergenName}
                    className="bg-[#2D3644] py-3 px-4 rounded-lg border border-[#2D3644] flex-row items-center"
                  >
                    <Text className="text-white font-PoppinsMedium text-base mr-2">
                      {allergenName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => removeCustomAllergen(allergenName)}
                    >
                      <Ionicons name="close-circle" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Common Allergens Section */}
          <View className="mb-6">
            <Text className="font-PoppinsSemiBold text-lg text-black mb-3">
              Common allergens
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {commonAllergens.map(renderAllergenButton)}
            </View>
          </View>

          {/* Other Allergens Section */}
          <View className="mb-6">
            <Text className="font-PoppinsSemiBold text-lg text-black mb-3">
              Other allergens & intolerances
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {otherAllergens
                .filter((allergen) => allergen.id !== "none")
                .map(renderAllergenButton)}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default memo(AllergensSelection);
