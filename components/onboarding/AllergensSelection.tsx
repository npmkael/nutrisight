import React from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Allergen {
  id: string;
  name: string;
  category: "common" | "other";
}

interface AllergensSelectionProps {
  selectedAllergens: string[];
  setSelectedAllergens: React.Dispatch<React.SetStateAction<string[]>>;
}

const commonAllergens: Allergen[] = [
  { id: "peanuts", name: "Peanuts", category: "common" },
  { id: "tree-nuts", name: "Tree Nuts", category: "common" },
  { id: "milk", name: "Milk", category: "common" },
  { id: "eggs", name: "Eggs", category: "common" },
  { id: "soy", name: "Soy", category: "common" },
  { id: "wheat", name: "Wheat", category: "common" },
  { id: "fish", name: "Fish", category: "common" },
  { id: "shellfish", name: "Shellfish", category: "common" },
];

const otherAllergens: Allergen[] = [
  { id: "sesame", name: "Sesame", category: "other" },
  { id: "sulfites", name: "Sulfites", category: "other" },
  { id: "celery", name: "Celery", category: "other" },
  { id: "mustard", name: "Mustard", category: "other" },
  { id: "lupin", name: "Lupin", category: "other" },
  { id: "molluscs", name: "Molluscs", category: "other" },
  { id: "gluten", name: "Gluten", category: "other" },
  { id: "lactose", name: "Lactose", category: "other" },
  { id: "fructose", name: "Fructose", category: "other" },
  { id: "histamine", name: "Histamine", category: "other" },
  { id: "nightshades", name: "Nightshades", category: "other" },
  { id: "dairy", name: "Dairy", category: "other" },
  { id: "none", name: "No allergies", category: "other" },
];

export default function AllergensSelection({
  selectedAllergens,
  setSelectedAllergens,
}: AllergensSelectionProps) {
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
          isSelected ? "bg-black border-black" : "bg-white border-gray-300"
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
