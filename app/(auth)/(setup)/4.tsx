import { commonAllergens, otherAllergens } from "@/utils/globalVars";
import { Allergen } from "@/utils/types";
import React, { memo } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useOnboarding } from "./_layout";

function AllergensSelection() {
  const { selectedAllergens, setSelectedAllergens } = useOnboarding();

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

  const renderAllergenButton = (allergen: Allergen) => {
    const isSelected = selectedAllergens.includes(allergen.id);

    return (
      <TouchableOpacity
        key={allergen.id}
        className={`py-3 px-4 rounded-lg border mb-2 ${
          isSelected
            ? "bg-primary border-transparent"
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
      <View className="flex-1 px-4 pt-4">
        {/* Header */}
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
          Allergies
        </Text>

        <Text className="font-Poppins text-md text-gray-600 mb-6">
          Do you have any food allergies or intolerances?
        </Text>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
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
              {otherAllergens.map(renderAllergenButton)}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default memo(AllergensSelection);
