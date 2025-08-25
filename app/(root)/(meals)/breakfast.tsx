import Typo from "@/components/Typo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  weight: number;
}

const foodItems: FoodItem[] = [
  { id: "1", name: "Cheeseburger", calories: 303, weight: 150 },
  { id: "2", name: "Oatmeal", calories: 150, weight: 40 },
  { id: "3", name: "Grilled Chicken Salad", calories: 350, weight: 300 },
  { id: "4", name: "Scrambled Eggs", calories: 160, weight: 100 },
  { id: "5", name: "Sushi Roll", calories: 250, weight: 180 },
  { id: "6", name: "Mashed Potatoes", calories: 240, weight: 200 },
  { id: "7", name: "Pancakes", calories: 320, weight: 150 },
];

const mealTypes = [
  { label: "Breakfast", route: "/breakfast" },
  { label: "Lunch", route: "/lunch" },
  { label: "Dinner", route: "/dinner" },
];

function BreakfastScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<
    "Recent" | "Favorites" | "Personal"
  >("Recent");
  const [searchQuery, setSearchQuery] = useState("");
  const [mealType, setMealType] = useState("Breakfast");
  const [selectedFoods, setSelectedFoods] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddFood = (foodId: string) => {
    setSelectedFoods((prev) => {
      if (prev.includes(foodId)) {
        // Remove from selected if already selected
        return prev.filter((id) => id !== foodId);
      } else {
        // Add to selected
        return [...prev, foodId];
      }
    });
    console.log("Toggle food:", foodId);
  };

  const handleMealTypeChange = (newMealType: string, route: string) => {
    setMealType(newMealType);
    setShowDropdown(false);
    if (route !== "/breakfast") {
      router.push(route as any);
    }
  };

  const filteredFoodItems = foodItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total calories for selected items
  const totalCalories = selectedFoods.reduce((total, foodId) => {
    const food = foodItems.find((item) => item.id === foodId);
    return total + (food?.calories || 0);
  }, 0);

  return (
    <SafeAreaView className="flex-1 bg-[#f7f7f7" edges={["top"]}>
      <View className="bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-5">
          <TouchableOpacity onPress={() => router.push("/(root)/(tabs)/home")}>
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>

          <View className="relative">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Typo size={20} className="font-PoppinsSemiBold mr-2">
                {mealType}
              </Typo>
              <Ionicons
                name={showDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color="black"
              />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showDropdown && (
              <Animated.View className="absolute top-8 left-1/2 -translate-x-1/2 w-[100px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {mealTypes.map((meal, index) => (
                  <TouchableOpacity
                    key={meal.label}
                    className={`px-4 py-3 ${
                      index !== mealTypes.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    } ${meal.label === mealType ? "bg-gray-50" : ""}`}
                    onPress={() => handleMealTypeChange(meal.label, meal.route)}
                  >
                    <Text className="font-PoppinsSemiBold text-base text-center">
                      {meal.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View className="mx-5 mb-4">
          <View className="flex-row items-center bg-[#f7f7f7] rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              className="flex-1 font-Poppins"
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity>
              <Ionicons name="options" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Log and Create Food Buttons */}
        <View className="flex-row mx-5 mb-6 gap-3">
          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-[#f7f7f7] rounded-xl py-3">
            <Ionicons name="flash-outline" size={18} color="black" />
            <Text className="ml-2 font-PoppinsSemiBold text-base">
              Quick Log
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-1 flex-row items-center justify-center bg-gray-100 rounded-xl py-3">
            <Ionicons name="add-circle-outline" size={18} color="black" />
            <Text className="ml-2 font-PoppinsSemiBold text-base">
              Create Food
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row mx-5 mb-4">
          {["Recent", "Favorites", "Personal"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setSelectedTab(tab as typeof selectedTab)}
              className={`flex-1 py-3 mr-2 last:mr-0 ${
                selectedTab === tab ? "bg-[#2D3644] " : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-center font-PoppinsSemiBold ${
                  selectedTab === tab ? "text-white" : "text-gray-600"
                }`}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Food Items List */}
      <ScrollView
        className="flex-1 px-5 mt-6"
        contentContainerStyle={{
          paddingBottom: selectedFoods.length > 0 ? 100 : 20,
        }}
      >
        {filteredFoodItems.map((item) => {
          const isSelected = selectedFoods.includes(item.id);

          return (
            <View
              key={item.id}
              className="flex-row items-center justify-between py-4 px-4 border-b border-gray-100 bg-white"
            >
              <TouchableOpacity
                className={`w-10 h-10 rounded-full border-2 items-center justify-center ${
                  isSelected
                    ? "bg-[#2D3644] border-[#2D3644]"
                    : "border-[#2D3644]"
                }`}
                onPress={() => handleAddFood(item.id)}
              >
                <Ionicons
                  name={isSelected ? "checkmark" : "add"}
                  size={20}
                  color={isSelected ? "white" : "#2D3644"}
                />
              </TouchableOpacity>

              <View className="flex-1 ml-4">
                <Text className="font-PoppinsSemiBold text-lg text-black mb-1">
                  {item.name}
                </Text>
                <Text className="font-Poppins text-sm text-gray-500">
                  {item.calories} kcal · {item.weight} gram
                </Text>
              </View>

              {/* eto pag ni-click mapupunta siya sa results, tas naka base kung ano yung food na pinindot */}
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Bottom Add Button - Only show when items are selected */}
      {selectedFoods.length > 0 && (
        <Animated.View
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-5 py-4"
          entering={SlideInDown.duration(500).damping(12)}
          exiting={SlideOutDown.duration(500).damping(12)}
        >
          <View className="flex-row items-center justify-between gap-8">
            <View className="flex-col items-center">
              <Text className="text-black font-Poppins text-base mr-2">
                kcal
              </Text>
              <Text className="text-black font-PoppinsBold text-xl">
                {totalCalories}
              </Text>
            </View>

            <TouchableOpacity className="flex-row items-center bg-[#2D3644] rounded-full py-4 px-6 flex-1 justify-center">
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white text-center font-PoppinsSemiBold text-base ml-2">
                Add ({selectedFoods.length})
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

export default memo(BreakfastScreen);
