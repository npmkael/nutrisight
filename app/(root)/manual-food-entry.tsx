import { EmptySearchState } from "@/components/EmptySearchState";
import { FoodSearchResultItem } from "@/components/FoodSearchResultItem";
import { SearchBar } from "@/components/SearchBar";
import { SearchResultShimmer } from "@/components/SearchResultShimmer";
import { BACKEND_URL, useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter, getMacroValue } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

function ManualFoodEntry() {
  const { user } = useAuth();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ScanResultType[]>([]);
  const [quickSearches, setQuickSearches] = useState<ScanResultType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load recent searches from local storage on mount
  useEffect(() => {
    const loadRecentSearches = async () => {
      const raw = await AsyncStorage.getItem("recent_searches");
      const list: ScanResultType[] = raw ? JSON.parse(raw) : [];
      setQuickSearches(list);
    };
    loadRecentSearches();
  }, []);

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

      const result: ScanResultType = data.data as ScanResultType;

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
      }, 1500); // 1500ms debounce

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
  const handleSelectFood = useCallback(async (food: ScanResultType) => {
    Keyboard.dismiss();

    // save to local storage for quick search next time
    const raw = await AsyncStorage.getItem("recent_searches");
    const list: ScanResultType[] = raw ? JSON.parse(raw) : [];
    const id = `${food.foodName ?? food.name}-${food.brand ?? ""}`;

    // remove existing entry with same id
    const deduped = list.filter(
      (f) => `${f.foodName ?? f.name}-${f.brand ?? ""}` !== id
    );

    // newest first
    deduped.unshift(food);
    const truncated = deduped.slice(0, 5); // keep only latest 5 entries

    // store back to local storage
    await AsyncStorage.setItem("recent_searches", JSON.stringify(truncated));
    setQuickSearches(truncated);

    // Navigate to results screen with the food data
    router.push({
      pathname: "/results",
      params: {
        scanResult: JSON.stringify(food),
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

  const handleClearRecentSearches = useCallback(async () => {
    await AsyncStorage.removeItem("recent_searches");
    setQuickSearches([]);
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
              <Ionicons name="arrow-back" size={20} color="#af4545ff" />
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
                  calories={
                    Number(
                      getMacroValue(
                        "calories",
                        ["energy", "calorie", "kcal"],
                        item
                      )
                    ) || 0
                  }
                  carbs={
                    Number(
                      getMacroValue(
                        "carbs",
                        ["carbohydrate", "carbs", "total carbohydrate"],
                        item
                      )
                    ) || 0
                  }
                  protein={
                    Number(
                      getMacroValue(
                        "protein",
                        ["protein", "total protein"],
                        item
                      )
                    ) || 0
                  }
                  fats={
                    Number(
                      getMacroValue(
                        "fats",
                        ["fat", "total fat", "fats", "lipid"],
                        item
                      )
                    ) || 0
                  }
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

                {quickSearches.length > 0 && (
                  <View className="space-y-3">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-gray-700 font-PoppinsMedium mb-2">
                        Quick searches:
                      </Text>

                      <TouchableOpacity
                        onPress={handleClearRecentSearches}
                        activeOpacity={0.8}
                        accessibilityRole="button"
                        accessibilityLabel="Clear recent searches"
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        className="flex-row items-center bg-white border border-gray-200 rounded-full p-3"
                      >
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#9CA3AF"
                          style={{ marginRight: 8 }}
                        />
                        <Text className="text-sm font-PoppinsMedium text-gray-600">
                          Clear
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {quickSearches.map((suggestion, idx) => (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => handleSelectFood(suggestion)}
                        className="bg-gray-50 rounded-xl p-4 flex-row items-center justify-between mb-2"
                      >
                        <Text className="text-gray-700 font-Poppins">
                          {suggestion.foodName || suggestion.name}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={18}
                          color="#9CA3AF"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </Animated.View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default memo(ManualFoodEntry);
