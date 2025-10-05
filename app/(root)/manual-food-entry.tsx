import { EmptySearchState } from "@/components/EmptySearchState";
import { FoodSearchResultItem } from "@/components/FoodSearchResultItem";
import { SearchBar } from "@/components/SearchBar";
import { SearchResultShimmer } from "@/components/SearchResultShimmer";
import { BACKEND_URL, useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo, useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanResultType } from "./main-camera";

// Food search result type
interface FoodSearchResult {
  foodName: string;
  name?: string;
  brand?: string;
  servingSize?: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fats?: number;
  nutritionData?: any;
  source?: string;
}

function ManualFoodEntry() {
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal state
  const [showManualEntry, setShowManualEntry] = useState(false);

  // Debounce timeout
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Search for food in database/API
  const searchFood = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await fetch(`${BACKEND_URL}/camera/get-food-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          foodName: query,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch food data");
      }

      const data = await res.json();
      console.log("Search result:", data);

      // Extract nutrition data
      const nutritionData = data.data?.nutritionData || [];
      const allItems = nutritionData.flatMap((cat: any) => cat.items);

      // Extract calories
      const calorieItem = allItems.find(
        (item: any) =>
          item.name?.toLowerCase().includes("energy") ||
          item.name?.toLowerCase().includes("calorie")
      );

      // Extract carbs
      const carbsItem = allItems.find((item: any) =>
        item.name?.toLowerCase().includes("carbohydrate")
      );

      // Extract protein
      const proteinItem = allItems.find((item: any) =>
        item.name?.toLowerCase().includes("protein")
      );

      // Extract fats
      const fatsItem = allItems.find(
        (item: any) =>
          item.name?.toLowerCase().includes("fat") ||
          item.name?.toLowerCase().includes("lipid")
      );

      const result: FoodSearchResult = {
        foodName: data.data?.foodName || data.data?.name || query,
        name: data.data?.name || data.data?.foodName,
        brand: data.data?.brand,
        servingSize: data.data?.servingSize,
        calories: calorieItem?.value,
        carbs: carbsItem?.value,
        protein: proteinItem?.value,
        fats: fatsItem?.value,
        nutritionData: data.data,
        source: data.data?.source,
      };

      setSearchResults([result]);
    } catch (error) {
      console.log("Error searching food:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    if (searchQuery.trim()) {
      const timeout = setTimeout(() => {
        searchFood(searchQuery);
      }, 500); // 500ms debounce

      setDebounceTimeout(timeout);
    } else {
      setSearchResults([]);
      setHasSearched(false);
      setIsSearching(false);
    }

    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [searchQuery]);

  // Handle search result selection
  const handleSelectFood = useCallback(async (food: FoodSearchResult) => {
    Keyboard.dismiss();

    // Navigate to results screen with the food data
    router.push({
      pathname: "/results",
      params: {
        scanResult: JSON.stringify(food.nutritionData),
        name: food.foodName || food.name,
        image: "", // No image for searched items
      },
    });
  }, []);

  // Handle manual entry submission
  const handleManualEntrySubmit = useCallback(
    (data: {
      foodName: string;
      servingSize: string;
      calories: string;
      carbs: string;
      protein: string;
      fats: string;
    }) => {
      // Create nutrition data in the format expected by results screen
      const nutritionData: ScanResultType = {
        foodName: capitalizeFirstLetter(data.foodName),
        servingSize: data.servingSize,
        ingredients: [],
        triggeredAllergens: [],
        nutritionData: [
          {
            title: "Other Nutrients",
            items: [
              {
                name: "Energy",
                value: parseFloat(data.calories) || 0,
                unit: "kcal",
              },
            ],
          },
          {
            title: "Macronutrients",
            items: [
              {
                name: "Total Carbohydrate",
                value: parseFloat(data.carbs) || 0,
                unit: "g",
              },
              {
                name: "Protein",
                value: parseFloat(data.protein) || 0,
                unit: "g",
              },
              {
                name: "Total Fat",
                value: parseFloat(data.fats) || 0,
                unit: "g",
              },
            ],
          },
        ],
        source: "user input",
      };

      setShowManualEntry(false);

      // Navigate to results screen
      router.push({
        pathname: "/results",
        params: {
          scanResult: JSON.stringify(nutritionData),
          name: data.foodName,
          image: "", // No image for manual entries
        },
      });
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="bg-white px-6 py-4"
        >
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
            >
              <Ionicons name="arrow-back" size={20} color="#374151" />
            </TouchableOpacity>

            <Text className="text-xl font-PoppinsSemiBold text-gray-900">
              Add Food
            </Text>

            <View className="w-10 h-10" />
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(200)}
          className="px-6 py-4 mb-4 bg-white"
        >
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={handleClearSearch}
            placeholder="Search for food..."
            loading={isSearching}
            autoFocus={false}
          />
        </Animated.View>

        {/* Content */}
        <View className="flex-1">
          {isSearching ? (
            // Loading state with shimmer
            <SearchResultShimmer count={5} />
          ) : searchResults.length > 0 ? (
            // Search Results
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.foodName}-${index}`}
              renderItem={({ item, index }) => (
                <FoodSearchResultItem
                  foodName={item.foodName || item.name || ""}
                  servingSize={item.servingSize}
                  calories={item.calories}
                  carbs={item.carbs}
                  protein={item.protein}
                  fats={item.fats}
                  brand={item.brand}
                  onPress={() => handleSelectFood(item)}
                  index={index}
                />
              )}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingTop: 12,
                paddingBottom: 24,
              }}
              showsVerticalScrollIndicator={false}
            />
          ) : hasSearched ? (
            // Empty state
            <EmptySearchState />
          ) : (
            // Initial state - show helpful suggestions
            <Animated.View
              entering={FadeIn.duration(500).delay(300)}
              className="flex-1 px-6"
            >
              <View className="bg-white rounded-3xl p-6 mb-6">
                <View className="items-center mb-6">
                  <View className="bg-emerald-100 rounded-full p-4 mb-4">
                    <Ionicons name="search" size={32} color="#10b981" />
                  </View>
                  <Text className="text-xl font-PoppinsSemiBold text-gray-900 mb-2 text-center">
                    Search for Food
                  </Text>
                  <Text className="text-gray-600 font-Poppins text-center">
                    Search our extensive database of foods to quickly add to
                    your diary
                  </Text>
                </View>

                <View className="space-y-3">
                  <Text className="text-gray-700 font-PoppinsMedium mb-2">
                    Quick searches:
                  </Text>
                  {["Apple", "Chicken breast", "White rice", "Banana"].map(
                    (suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => setSearchQuery(suggestion)}
                        className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between mb-2"
                      >
                        <Text className="text-gray-700 font-Poppins">
                          {suggestion}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(ManualFoodEntry);
