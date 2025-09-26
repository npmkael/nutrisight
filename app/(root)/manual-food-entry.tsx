import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";
import { BACKEND_URL, DietHistory, useAuth } from "@/context/AuthContext";
import { capitalizeFirstLetter } from "@/utils/helpers";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { memo, useCallback, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { ScanResultType } from "./main-camera";

const BREAKFAST_START = 6 * 60; // 360 (06:00)
const BREAKFAST_END = 10 * 60; // 600 (10:00)

const LUNCH_START = 12 * 60; // 720 (12:00)
const LUNCH_END = 14 * 60; // 840 (14:00)

const DINNER_START = 18 * 60; // 1080 (18:00)
const DINNER_END = 21 * 60; // 1260 (21:00)

function ManualFoodEntry() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Form state
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [carbs, setCarbs] = useState("");
  const [protein, setProtein] = useState("");
  const [fats, setFats] = useState("");
  const [servingSize, setServingSize] = useState("");

  // Error states for validation
  const [errors, setErrors] = useState({
    foodName: "",
    calories: "",
    carbs: "",
    protein: "",
    fats: "",
    servingSize: "",
  });

  // Focus states for inputs
  const [focusedInput, setFocusedInput] = useState("");

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  const getMealTime = useCallback(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours * 60 + minutes;

    if (currentTime >= BREAKFAST_START && currentTime <= BREAKFAST_END) {
      return "breakfast";
    } else if (currentTime >= LUNCH_START && currentTime <= LUNCH_END) {
      return "lunch";
    } else if (currentTime >= DINNER_START && currentTime <= DINNER_END) {
      return "dinner";
    } else {
      return "snacks";
    }
  }, []);

  const getMealTimeDisplayName = useCallback(() => {
    const mealTime = getMealTime();
    return mealTime.charAt(0).toUpperCase() + mealTime.slice(1);
  }, []);

  // Validation functions
  const validateField = useCallback((field: string, value: string) => {
    let error = "";

    switch (field) {
      case "foodName":
        if (!value.trim()) {
          error = "Food name is required";
        } else if (value.trim().length < 2) {
          error = "Food name must be at least 2 characters";
        }
        break;
      case "calories":
        if (!value.trim()) {
          error = "Calories are required";
        } else if (isNaN(Number(value)) || Number(value) < 0) {
          error = "Please enter a valid number";
        } else if (Number(value) > 10000) {
          error = "Calories seem unusually high";
        }
        break;
      case "carbs":
      case "protein":
      case "fats":
        if (value.trim() && (isNaN(Number(value)) || Number(value) < 0)) {
          error = "Please enter a valid number";
        } else if (Number(value) > 1000) {
          error = "Value seems unusually high";
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error === "";
  }, []);

  const validateForm = useCallback(() => {
    const isValidName = validateField("foodName", foodName);
    const isValidCalories = validateField("calories", calories);
    const isValidCarbs = validateField("carbs", carbs);
    const isValidProtein = validateField("protein", protein);
    const isValidFats = validateField("fats", fats);

    return (
      isValidName &&
      isValidCalories &&
      isValidCarbs &&
      isValidProtein &&
      isValidFats
    );
  }, [foodName, calories, carbs, protein, fats]);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prevQ) => {
      const newQ = prevQ > 1 ? prevQ - 1 : 1;
      setCalories((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num) || prevQ === 1) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setCarbs((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num) || prevQ === 1) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setProtein((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num) || prevQ === 1) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setFats((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num) || prevQ === 1) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      return newQ;
    });
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prevQ) => {
      const newQ = prevQ + 1;
      setCalories((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setCarbs((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setProtein((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      setFats((prev) => {
        const num = parseFloat(prev);
        if (isNaN(num)) return prev;
        return ((num / prevQ) * newQ).toFixed(2);
      });
      return newQ;
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors before saving.");
      return;
    }

    setLoading(true);

    try {
      const mealTime = getMealTime();

      // Create nutrition data in the same format as scan results
      const nutritionData = [
        {
          title: "Other Nutrients",
          items: [
            {
              name: "Energy",
              value: parseFloat(calories) || 0,
              unit: "kcal",
            },
          ],
        },
        {
          title: "Macronutrients",
          items: [
            {
              name: "Total Carbohydrate",
              value: parseFloat(carbs) || 0,
              unit: "g",
            },
            {
              name: "Protein",
              value: parseFloat(protein) || 0,
              unit: "g",
            },
            {
              name: "Total Fat",
              value: parseFloat(fats) || 0,
              unit: "g",
            },
          ],
        },
      ];

      // Create nutrition data object for the API
      const allNutritionItems = nutritionData.flatMap(
        (category) => category.items
      );

      // Create meal record payload
      const mealRecordPayload = {
        name: capitalizeFirstLetter(foodName.trim()),
        calorie: parseFloat(calories) || 0,
      };

      // Create diet history object following the correct interface
      const meal = mealTime === "snacks" ? "other" : mealTime;
      const dietHistory: DietHistory = {
        date: new Date().toISOString(),
        nutritionalData: allNutritionItems.map((nutrient) => ({
          [nutrient.name.toLowerCase()]: Number(nutrient.value),
        })),
        breakfast: meal === "breakfast" ? [mealRecordPayload] : [],
        lunch: meal === "lunch" ? [mealRecordPayload] : [],
        dinner: meal === "dinner" ? [mealRecordPayload] : [],
        otherMealTime: meal === "other" ? [mealRecordPayload] : [],
      };

      const res = await fetch(`${BACKEND_URL}/account/update-diet-history`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietHistoryPayload: dietHistory,
        }),
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log("Error saving results:", errorData);
        alert("Error saving results. Please try again.");
        return;
      }
      const data = await res.json();
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        return {
          ...prevUser,
          dietHistory: data.dietHistory, // <-- replace, not append
        };
      });

      const result: ScanResultType = {
        foodName: capitalizeFirstLetter(foodName),
        id: Date.now(),
        servingSize,
        nutritionData,
        source: "user input",
        triggeredAllergens: [],
        ingredients: [],
      };

      // save result to cache
      // check first if its greater than 10
      const stored = await AsyncStorage.getItem(meal);
      const recentResults = stored ? (JSON.parse(stored) as any[]) : [];
      // keep max 10 entries
      while (recentResults.length >= 10) recentResults.shift();
      recentResults.push(result);
      await AsyncStorage.setItem(meal, JSON.stringify(recentResults));

      const newStored = await AsyncStorage.getItem(meal);
      console.log("Saved to AsyncStorage:", newStored);

      Alert.alert("Success!", "Food entry saved successfully!", [
        {
          text: "OK",
          onPress: () => router.replace("/(root)/(tabs)/home"),
        },
      ]);
    } catch (error) {
      console.log("Error saving food entry:", error);
      Alert.alert(
        "Error",
        "Failed to save food entry. Please check your connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  }, [foodName, calories, carbs, protein, fats]);

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white">
        {/* Enhanced Header */}
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-row items-center justify-between px-6 py-4"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-50"
          >
            <Ionicons name="arrow-back" size={20} color="#374151" />
          </TouchableOpacity>

          <Text className="text-xl font-PoppinsSemiBold text-gray-900">
            Add Food Entry
          </Text>

          <View className="w-10 h-10" />
        </Animated.View>

        <View className="flex-1">
          {/* Date/Time and Quantity */}
          <View className="flex-row items-center justify-between p-6">
            {/* Date Section */}
            <View className="bg-gray-50 rounded-2xl p-4 flex-1 mr-4">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={20}
                  color="#6B7280"
                />
                <Text className="text-sm text-gray-600 font-PoppinsMedium ml-2">
                  Today
                </Text>
              </View>
              <Text className="text-lg text-gray-900 font-PoppinsBold">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>

            {/* Quantity Section */}
            <View className="bg-gray-50 rounded-2xl p-4">
              <Text className="text-sm text-gray-600 font-PoppinsMedium mb-3 text-center">
                Quantity
              </Text>
              <View className="flex-row items-center justify-center gap-4">
                <TouchableOpacity
                  className={`w-12 h-12 rounded-full items-center justify-center ${
                    quantity <= 1 ? "bg-gray-200" : ""
                  }`}
                  onPress={handleDecreaseQuantity}
                  disabled={quantity <= 1}
                  style={{
                    elevation: quantity > 1 ? 2 : 0,
                    backgroundColor: quantity > 1 ? "#2D3644" : undefined,
                  }}
                >
                  <AntDesign
                    name="minus"
                    size={18}
                    color={quantity <= 1 ? "#9CA3AF" : "white"}
                  />
                </TouchableOpacity>
                <View className="w-16 items-center">
                  <Text className="text-2xl text-gray-900 font-PoppinsBold">
                    {quantity}
                  </Text>
                  <Text className="text-xs text-gray-500 font-Poppins">
                    {quantity === 1 ? "serving" : "servings"}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-12 h-12 rounded-full items-center justify-center"
                  onPress={handleIncreaseQuantity}
                  style={{ elevation: 2, backgroundColor: "#2D3644" }}
                >
                  <AntDesign name="plus" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Form */}
          <ScrollView
            className="flex-1 px-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
          >
            {/* Food Name Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-PoppinsMedium mb-3">
                Food Name *
              </Text>
              <View className="relative">
                <TextInput
                  className={`bg-white rounded-2xl px-6 py-4 font-Poppins text-gray-900 ${
                    focusedInput === "foodName"
                      ? "border-2 border-blue-500"
                      : errors.foodName
                        ? "border-2 border-red-500"
                        : "border border-gray-200"
                  }`}
                  placeholder="Enter food name (e.g., Grilled Chicken Breast)"
                  placeholderTextColor="#9CA3AF"
                  value={foodName}
                  onChangeText={(text) => {
                    setFoodName(text);
                    if (errors.foodName) validateField("foodName", text);
                  }}
                  onFocus={() => setFocusedInput("foodName")}
                  onBlur={() => {
                    setFocusedInput("");
                    validateField("foodName", foodName);
                  }}
                  style={{ fontSize: 16 }}
                  accessible={true}
                  accessibilityLabel="Food name input"
                  accessibilityHint="Enter the name of the food you want to add to your diet"
                />
                {errors.foodName ? (
                  <View className="flex-row items-center mt-2">
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color="#EF4444"
                    />
                    <Text className="text-red-500 text-sm font-Poppins ml-1">
                      {errors.foodName}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Serving Size Input */}
            <View className="mb-6">
              <Text className="text-gray-700 font-PoppinsMedium mb-3">
                Serving Size
              </Text>
              <View className="relative">
                <TextInput
                  className={`bg-white rounded-2xl px-6 py-4 font-Poppins text-gray-900 ${
                    focusedInput === "servingSize"
                      ? "border-2 border-blue-500"
                      : "border border-gray-200"
                  }`}
                  placeholder="e.g., 100g, 1 cup, 1 piece"
                  placeholderTextColor="#9CA3AF"
                  value={servingSize}
                  onChangeText={setServingSize}
                  onFocus={() => setFocusedInput("servingSize")}
                  onBlur={() => setFocusedInput("")}
                  style={{ fontSize: 16 }}
                  accessible={true}
                  accessibilityLabel="Serving size input"
                  accessibilityHint="Optional: Enter the serving size for this food item"
                />
              </View>
            </View>

            {/* Calories Card */}
            <View
              className={`bg-white rounded-3xl px-6 py-6 mb-6 ${
                focusedInput === "calories"
                  ? "border-2 border-blue-500 shadow-lg"
                  : errors.calories
                    ? "border-2 border-red-500"
                    : "border border-gray-100 shadow-sm"
              }`}
              style={{ elevation: focusedInput === "calories" ? 8 : 2 }}
            >
              <View className="flex-row items-center">
                <View className="bg-orange-100 rounded-2xl p-4">
                  <Image
                    source={require("@/assets/icons/calories.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Total Calories *
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={calories}
                      onChangeText={(text) => {
                        setCalories(text);
                        if (errors.calories) validateField("calories", text);
                      }}
                      onFocus={() => setFocusedInput("calories")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("calories", calories);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 32, flex: 1 }}
                    />
                    <Text className="text-gray-500 font-PoppinsMedium text-lg ml-2">
                      kcal
                    </Text>
                  </View>
                </View>
              </View>
              {errors.calories ? (
                <View className="flex-row items-center mt-3 pt-3 border-t border-red-100">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#EF4444"
                  />
                  <Text className="text-red-500 text-sm font-Poppins ml-1">
                    {errors.calories}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Carbs Card */}
            <View
              className={`bg-white rounded-3xl px-6 py-6 mb-6 ${
                focusedInput === "carbs"
                  ? "border-2 border-green-500 shadow-lg"
                  : errors.carbs
                    ? "border-2 border-red-500"
                    : "border border-gray-100 shadow-sm"
              }`}
              style={{ elevation: focusedInput === "carbs" ? 8 : 2 }}
            >
              <View className="flex-row items-center">
                <View className="bg-green-100 rounded-2xl p-4">
                  <Image
                    source={require("@/assets/icons/carbs.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Carbohydrates
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={carbs}
                      onChangeText={(text) => {
                        setCarbs(text);
                        if (errors.carbs) validateField("carbs", text);
                      }}
                      onFocus={() => setFocusedInput("carbs")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("carbs", carbs);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 24, flex: 1 }}
                    />
                    <Text
                      className="font-PoppinsBold text-gray-500 ml-2"
                      style={{ fontSize: 20 }}
                    >
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.carbs ? (
                <View className="flex-row items-center mt-3 pt-3 border-t border-red-100">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#EF4444"
                  />
                  <Text className="text-red-500 text-sm font-Poppins ml-1">
                    {errors.carbs}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Protein Card */}
            <View
              className={`bg-white rounded-3xl px-6 py-6 mb-6 ${
                focusedInput === "protein"
                  ? "border-2 border-purple-500 shadow-lg"
                  : errors.protein
                    ? "border-2 border-red-500"
                    : "border border-gray-100 shadow-sm"
              }`}
              style={{ elevation: focusedInput === "protein" ? 8 : 2 }}
            >
              <View className="flex-row items-center">
                <View className="bg-purple-100 rounded-2xl p-4">
                  <Image
                    source={icons.protein}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Protein
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={protein}
                      onChangeText={(text) => {
                        setProtein(text);
                        if (errors.protein) validateField("protein", text);
                      }}
                      onFocus={() => setFocusedInput("protein")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("protein", protein);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 24, flex: 1 }}
                    />
                    <Text
                      className="font-PoppinsBold text-gray-500 ml-2"
                      style={{ fontSize: 20 }}
                    >
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.protein ? (
                <View className="flex-row items-center mt-3 pt-3 border-t border-red-100">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#EF4444"
                  />
                  <Text className="text-red-500 text-sm font-Poppins ml-1">
                    {errors.protein}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Fats Card */}
            <View
              className={`bg-white rounded-3xl px-6 py-6 mb-6 ${
                focusedInput === "fats"
                  ? "border-2 border-yellow-500 shadow-lg"
                  : errors.fats
                    ? "border-2 border-red-500"
                    : "border border-gray-100 shadow-sm"
              }`}
              style={{ elevation: focusedInput === "fats" ? 8 : 2 }}
            >
              <View className="flex-row items-center">
                <View className="bg-yellow-100 rounded-2xl p-4">
                  <Image
                    source={icons.fats}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-600 font-PoppinsMedium mb-1">
                    Total Fat
                  </Text>
                  <View className="flex-row items-baseline">
                    <TextInput
                      className="font-PoppinsBold text-gray-900"
                      placeholder="0"
                      placeholderTextColor="#D1D5DB"
                      value={fats}
                      onChangeText={(text) => {
                        setFats(text);
                        if (errors.fats) validateField("fats", text);
                      }}
                      onFocus={() => setFocusedInput("fats")}
                      onBlur={() => {
                        setFocusedInput("");
                        validateField("fats", fats);
                      }}
                      keyboardType="numeric"
                      style={{ fontSize: 24, flex: 1 }}
                    />
                    <Text
                      className="font-PoppinsBold text-gray-500 ml-2"
                      style={{ fontSize: 20 }}
                    >
                      g
                    </Text>
                  </View>
                </View>
              </View>
              {errors.fats ? (
                <View className="flex-row items-center mt-3 pt-3 border-t border-red-100">
                  <MaterialCommunityIcons
                    name="alert-circle"
                    size={16}
                    color="#EF4444"
                  />
                  <Text className="text-red-500 text-sm font-Poppins ml-1">
                    {errors.fats}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Save Button */}
            <View className="pt-6 pb-8">
              <CustomButton
                title={loading ? "Saving..." : "Save Food Entry"}
                onPress={handleSave}
                disabled={loading}
                className="shadow-lg"
                style={{
                  backgroundColor: loading ? "#9CA3AF" : "#2D3644",
                  elevation: loading ? 0 : 4,
                  minHeight: 56,
                }}
                accessible={true}
                accessibilityLabel={
                  loading
                    ? "Saving food entry, please wait"
                    : "Save food entry to your diet history"
                }
                accessibilityHint="Double tap to save the food entry with the nutrition information you entered"
                accessibilityRole="button"
                IconLeft={
                  loading
                    ? undefined
                    : () => (
                        <MaterialCommunityIcons
                          name="content-save"
                          size={20}
                          color="white"
                          style={{ marginRight: 8 }}
                        />
                      )
                }
              />

              {/* Helper text */}
              <Text className="text-center text-gray-500 font-Poppins text-sm mt-4 px-4">
                This will be added to your{" "}
                {getMealTimeDisplayName().toLowerCase()} for today
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

export default memo(ManualFoodEntry);
