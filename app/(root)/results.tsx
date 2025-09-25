import CaloriesBottomSheet from "@/components/CaloriesBottomSheet";
import CarbsBottomSheet from "@/components/CarbsBottomSheet";
import CustomButton from "@/components/CustomButton";
import FatsBottomSheet from "@/components/FatsBottomSheet";
import { Ingredient } from "@/components/ingredient";
import Loading from "@/components/Loading";
import ProteinBottomSheet from "@/components/ProteinBottomSheet";
import ResultSourceBadge from "@/components/result-source-badge";
import Typo from "@/components/Typo";
import { icons } from "@/constants";
import { BACKEND_URL, DietHistory, useAuth } from "@/context/AuthContext";
import {
  capitalizeFirstLetter,
  removeDuplicateTriggeredAllergens,
} from "@/utils/helpers";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ScanResultType } from "./main-camera";

const BREAKFAST_START = 6 * 60; // 360 (06:00)
const BREAKFAST_END = 10 * 60; // 600 (10:00)

const LUNCH_START = 12 * 60; // 720 (12:00)
const LUNCH_END = 14 * 60; // 840 (14:00)

const DINNER_START = 18 * 60; // 1080 (18:00)
const DINNER_END = 21 * 60; // 1260 (21:00)

function Results() {
  const { setUser } = useAuth();
  const { image, name, scanResult, mealTime } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<ScanResultType | null>(
    scanResult ? (JSON.parse(scanResult as string) as ScanResultType) : null
  );

  // Bottom sheet refs and state
  const caloriesBottomSheetRef = useRef<BottomSheet | null>(null);
  const carbsBottomSheetRef = useRef<BottomSheet | null>(null);
  const proteinBottomSheetRef = useRef<BottomSheet | null>(null);
  const fatsBottomSheetRef = useRef<BottomSheet | null>(null);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const uniqueAllergens = removeDuplicateTriggeredAllergens(
    result?.triggeredAllergens!
  );

  useEffect(() => {
    if (result) {
      console.log("Scan Result:", result);
    }
  }, [result]);

  console.log("Meal Time results:", mealTime);

  // Helper function to get macro value
  const getMacroValue = useCallback(
    (macroName: string, searchKeys: string[]) => {
      if (editedValues[macroName]) {
        return editedValues[macroName];
      }

      const macroItem = result?.nutritionData
        .flatMap((category) => category.items)
        .find((item) =>
          searchKeys.some((key) =>
            (item.name as string).toLowerCase().includes(key)
          )
        );

      return macroItem
        ? Number(macroItem.value) % 1 === 0
          ? Number(macroItem.value).toFixed(0)
          : Number(macroItem.value).toFixed(2)
        : "0";
    },
    [result, editedValues]
  );

  // Handle macro edit functions
  const handleEditCalories = useCallback(() => {
    caloriesBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleEditCarbs = useCallback(() => {
    carbsBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleEditProtein = useCallback(() => {
    proteinBottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleEditFats = useCallback(() => {
    fatsBottomSheetRef.current?.snapToIndex(0);
  }, []);

  // Handle macro save functions
  const applyEditedToResult = useCallback(
    (searchKeys: string[], value: string) => {
      setResult((prev) => {
        if (!prev) return prev;
        const num = Number(value);
        const newNutritionData = prev.nutritionData.map((cat) => ({
          ...cat,
          items: cat.items.map((item) => {
            const name = (item.name as string).toLowerCase();
            if (searchKeys.some((k) => name.includes(k))) {
              return { ...item, value: isNaN(num) ? item.value : num };
            }
            return item;
          }),
        }));
        return { ...prev, nutritionData: newNutritionData };
      });
    },
    []
  );

  const handleSaveCalories = useCallback(
    (value: string) => {
      setEditedValues((prev) => ({ ...prev, calories: value }));
      applyEditedToResult(["energy", "calorie", "kcal"], value);
    },
    [applyEditedToResult]
  );

  const handleSaveCarbs = useCallback(
    (value: string) => {
      setEditedValues((prev) => ({ ...prev, carbs: value }));
      applyEditedToResult(
        ["carbohydrate", "carbs", "total carbohydrate"],
        value
      );
    },
    [applyEditedToResult]
  );

  const handleSaveProtein = useCallback(
    (value: string) => {
      setEditedValues((prev) => ({ ...prev, protein: value }));
      applyEditedToResult(["protein", "total protein"], value);
    },
    [applyEditedToResult]
  );

  const handleSaveFats = useCallback(
    (value: string) => {
      setEditedValues((prev) => ({ ...prev, fats: value }));
      applyEditedToResult(["fat", "total fat", "fats", "lipid"], value);
    },
    [applyEditedToResult]
  );

  // Handle bottom sheet close functions
  const handleCloseCalories = useCallback(() => {
    // Reset state if needed
  }, []);

  const handleCloseCarbs = useCallback(() => {
    // Reset state if needed
  }, []);

  const handleCloseProtein = useCallback(() => {
    // Reset state if needed
  }, []);

  const handleCloseFats = useCallback(() => {
    // Reset state if needed
  }, []);

  const handleBack = useCallback(() => {
    if (name) {
      router.back();
    } else {
      router.replace("/(root)/main-camera");
    }
  }, [name, router]);

  const handleSave = useCallback(async () => {
    const allNutritionItems = result?.nutritionData.flatMap(
      (category) => category.items
    );

    // get calorie with "energy" or "calorie" as keyword
    // return the value
    const calorieValue = allNutritionItems?.find(
      (item) =>
        (item.name as string).toLowerCase().includes("energy") ||
        (item.name as string).toLowerCase().includes("calorie")
    )?.value;

    // 6:00am - 10:00am breakfast
    // 12:00pm - 2:00pm lunch
    // 6:00pm - 9:00pm dinner
    // 10:30pm - 4:59am otherMealTimes
    const now = new Date();
    const minutesSinceMidnight = now.getHours() * 60 + now.getMinutes();

    let meal =
      (mealTime as string) === "snacks" ? "other" : (mealTime as string);

    if (!mealTime) {
      if (
        minutesSinceMidnight >= BREAKFAST_START &&
        minutesSinceMidnight < BREAKFAST_END
      ) {
        meal = "breakfast";
      } else if (
        minutesSinceMidnight >= LUNCH_START &&
        minutesSinceMidnight < LUNCH_END
      ) {
        meal = "lunch";
      } else if (
        minutesSinceMidnight >= DINNER_START &&
        minutesSinceMidnight < DINNER_END
      ) {
        meal = "dinner";
      } else {
        meal = "other";
      }
    }
    const mealRecordPayload = {
      name: result?.name || result?.foodName || "Unknown",
      calorie: calorieValue || 0,
    };

    // Save the result or perform any action
    const dietHistoryPayload: DietHistory = {
      date: now.toISOString(),
      nutritionalData: (allNutritionItems ?? []).map((nutrient) => ({
        [(nutrient.name as string).toLowerCase()]: Number(nutrient.value),
      })),
      breakfast: meal === "breakfast" ? [mealRecordPayload] : [],
      lunch: meal === "lunch" ? [mealRecordPayload] : [],
      dinner: meal === "dinner" ? [mealRecordPayload] : [],
      otherMealTime: meal === "other" ? [mealRecordPayload] : [],
    };

    console.log("Saving diet history:", dietHistoryPayload);
    console.log("Meal Record Payload:", mealRecordPayload);
    console.log("Breakfast Meal Diet History:", dietHistoryPayload.breakfast);
    console.log("Lunch Meal Diet History:", dietHistoryPayload.lunch);
    console.log("Dinner Meal Diet History:", dietHistoryPayload.dinner);
    console.log(
      "Other Meal Time Diet History:",
      dietHistoryPayload.otherMealTime
    );

    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/account/update-diet-history`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dietHistoryPayload,
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

      // save result to cache
      // check first if its greater than 10
      const stored = await AsyncStorage.getItem(meal);
      const recentResults = stored ? (JSON.parse(stored) as any[]) : [];
      // keep max 10 entries
      while (recentResults.length >= 10) recentResults.shift();
      recentResults.push({ ...result, id: Date.now() }); // add unique id
      await AsyncStorage.setItem(meal, JSON.stringify(recentResults));

      const newStored = await AsyncStorage.getItem(meal);
      console.log("Saved to AsyncStorage:", newStored);

      alert("Successfully saved results.");
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.log("Error saving results:", error);
      alert("Error saving results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [result, setUser, router]);

  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prevQ) => {
      const newQ = prevQ > 1 ? prevQ - 1 : 1;
      setResult((p) => {
        if (!p) return p;
        return {
          ...p,
          nutritionData: p.nutritionData.map((category) => ({
            ...category,
            items: category.items.map((item) => ({
              ...item,
              value: (Number(item.value) / prevQ) * newQ,
            })),
          })),
        };
      });
      return newQ;
    });
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prevQ) => {
      const newQ = prevQ + 1;
      setResult((p) => {
        if (!p) return p;
        return {
          ...p,
          nutritionData: p.nutritionData.map((category) => ({
            ...category,
            items: category.items.map((item) => ({
              ...item,
              value: (Number(item.value) / prevQ) * newQ,
            })),
          })),
        };
      });
      return newQ;
    });
  }, []);

  if (!result) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Loading />
      </View>
    );
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-[#F7F7F7]">
        <Image
          source={{ uri: image as string }}
          style={{ height: 300, width: "100%" }}
          resizeMode="cover"
        />
        {/* Header */}
        <TouchableOpacity
          className="absolute left-4 right-0 top-4 w-10 h-10 rounded-full bg-black/50 z-10 items-center justify-center"
          onPress={handleBack}
        >
          <View className="items-center justify-center">
            <Feather name="chevron-left" size={18} color="white" />
          </View>
        </TouchableOpacity>

        <View className="flex-1 bg-white mt-[-24px]">
          {/* Date/Time */}
          {/* Quantity */}
          <View className="flex-row items-center justify-between p-4">
            <View className="bg-[#F3F4F7] rounded-2xl flex-row items-center justify-center gap-2 px-2 py-2 w-32">
              <AntDesign name="camera" size={24} color="black" />
              <View>
                <Text className="text-xs text-gray-400 font-Poppins">
                  {new Date().toLocaleDateString("en-GB")}
                </Text>
                <Text className="text-xs text-gray-400 font-Poppins">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-center gap-5">
              <TouchableOpacity
                className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center"
                onPress={handleDecreaseQuantity}
              >
                <AntDesign name="minus" size={20} color="black" />
              </TouchableOpacity>
              <Text className="text-xl text-black font-PoppinsMedium">
                {quantity}
              </Text>
              <TouchableOpacity
                className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center"
                onPress={handleIncreaseQuantity}
              >
                <AntDesign name="plus" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Card */}
          <ScrollView
            className="flex-1 px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 5 }}
          >
            {/* Source Badge */}
            {result.source && <ResultSourceBadge source={result.source} />}
            {/* Food Name */}
            <Typo
              size={28}
              className="text-gray-900 mb-6"
              style={{
                fontFamily: "GeistSemiBold",
              }}
            >
              {`${capitalizeFirstLetter(result.name || result.foodName || "")} ${result.brand ? `(${result.brand})` : ""}`}
            </Typo>
            {/* Calories Card */}
            <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 border border-gray-200 mb-6">
              <View className="bg-gray-100 rounded-2xl p-4">
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={36}
                  color="black"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-500 font-Poppins">
                  Estimated Total Calories
                </Text>
                <Text className="text-gray-500 font-Poppins">
                  {result?.servingSize
                    ? `${quantity > 1 ? `${quantity} x ` : ""}${result.servingSize} Serving Size`
                    : ""}
                </Text>
                <Text className="font-PoppinsBold text-gray-900 text-4xl">
                  {getMacroValue("calories", ["energy", "calories", "kcal"])}{" "}
                  kcal
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditCalories}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Feather name="edit-2" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Carbs Card */}
            <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 border border-gray-200 mb-6">
              <View className="bg-gray-100 rounded-2xl p-4">
                <Image
                  source={require("@/assets/icons/carbs.png")}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-500 font-Poppins">
                  Carbohydrates
                </Text>
                <Text
                  className="font-PoppinsBold text-gray-900"
                  style={{ fontSize: 24 }}
                >
                  {getMacroValue("carbs", [
                    "carbohydrate",
                    "carbs",
                    "total carbohydrate",
                  ])}
                  g
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditCarbs}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Feather name="edit-2" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Protein Card */}
            <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 border border-gray-200 mb-6">
              <View className="bg-gray-100 rounded-2xl p-4">
                <Image
                  source={icons.protein}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-500 font-Poppins">Protein</Text>
                <Text
                  className="font-PoppinsBold text-gray-900"
                  style={{ fontSize: 24 }}
                >
                  {getMacroValue("protein", ["protein", "total protein"])}g
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditProtein}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Feather name="edit-2" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Fats Card */}
            <View className="flex-row items-center bg-white rounded-2xl px-6 py-4 border border-gray-200 mb-6">
              <View className="bg-gray-100 rounded-2xl p-4">
                <Image
                  source={icons.fats}
                  style={{ width: 36, height: 36 }}
                  resizeMode="contain"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-500 font-Poppins">Total Fat</Text>
                <Text
                  className="font-PoppinsBold text-gray-900"
                  style={{ fontSize: 24 }}
                >
                  {getMacroValue("fats", ["fat", "total fat", "fats", "lipid"])}
                  g
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleEditFats}
                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
              >
                <Feather name="edit-2" size={16} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Estimated Nutrients Summary */}
            <View className="flex-col bg-white rounded-2xl pt-4 shadow border border-gray-100 mb-4">
              <View className="flex-col mx-4 mb-4">
                <Text
                  className="font-Poppins"
                  style={{
                    lineHeight: 10,
                  }}
                >
                  Estimated Nutrients
                </Text>
                <Text className="font-PoppinsSemiBold text-3xl">Summary</Text>
              </View>

              <View>
                {result.nutritionData.map((category, categoryIndex) => (
                  <View key={category.title}>
                    <View className="px-6 py-4 border-b border-[#e8e4dd]">
                      <View className="flex-row items-center gap-3">
                        {/* <Feather name="zap" size={18} color="black" /> */}
                        <Text className="text-black tracking-white text-lg font-PoppinsSemiBold">
                          {category.title.charAt(0).toUpperCase() +
                            category.title.slice(1)}
                        </Text>
                      </View>
                    </View>

                    {category.items.map((item, itemIndex) => (
                      <View
                        key={`${category.title}-${item.name}`}
                        className={`px-6 py-3 border-b border-[#e8e4dd]/50 ${
                          itemIndex === category.items.length - 1 &&
                          categoryIndex === result.nutritionData.length - 1
                            ? "border-b-0"
                            : ""
                        }`}
                      >
                        <View className="flex-row items-center justify-between">
                          <Text className="font-PoppinsMedium text-black text-sm">
                            {capitalizeFirstLetter(item.name as string)}
                          </Text>
                          <Text className="text-black font-PoppinsSemiBold bg-[#F4F4F4] px-3 py-1 rounded-full text-sm">
                            {item.value.toFixed(2)}
                            {item.unit}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            </View>

            {/* Common Ingredients */}
            <View className="flex-col bg-white rounded-2xl pt-4 shadow border border-gray-100 mb-4">
              <View className="flex-col mx-4 mb-4">
                <Text
                  className="font-Poppins"
                  style={{
                    lineHeight: 10,
                  }}
                >
                  Common
                </Text>
                <Text className="font-PoppinsSemiBold text-3xl">
                  Ingredients
                </Text>
              </View>
              <View className="flex-col mx-4 mb-4 gap-2">
                {result.ingredients.length > 0
                  ? result.ingredients.map((ingredient, idx) => {
                      const triggers = result.triggeredAllergens.filter(
                        (a) =>
                          a.ingredient.toLowerCase() ===
                          ingredient.toLowerCase()
                      );
                      return (
                        <Ingredient
                          key={idx}
                          name={ingredient}
                          allergen={
                            triggers.length > 0
                              ? triggers.map((t) => t.allergen)
                              : undefined
                          }
                          onDelete={() =>
                            setResult((p) => ({
                              ...p!,
                              ingredients: p!.ingredients.filter(
                                (i) => i !== ingredient
                              ),
                              triggeredAllergens: p!.triggeredAllergens.filter(
                                (a) =>
                                  a.ingredient.toLowerCase() !==
                                  ingredient.toLowerCase()
                              ),
                            }))
                          }
                        />
                      );
                    })
                  : null}
              </View>
              <View className="mx-4 mb-4">
                <TouchableOpacity className="px-6 py-4 items-center justify-center bg-transparent border border-primary rounded-lg flex-row gap-2">
                  <Ionicons name="add" size={16} color="primary" />
                  <Text
                    style={{
                      fontFamily: "PoppinsMedium",
                      color: "#2D3644",
                    }}
                  >
                    Add Ingredients
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Allergens */}
            {result.triggeredAllergens.length > 0 && (
              <View className="rounded-2xl p-4 shadow border border-[#FFA4A4] bg-[#FFEEEE] mb-6">
                <View className="flex-row gap-4">
                  <FontAwesome
                    name="warning"
                    size={18}
                    color="red"
                    className="mt-1"
                  />

                  <View className="flex-col gap-1 flex-1 min-w-0">
                    <Text className="font-PoppinsBold text-2xl mb-2">
                      Possible Allergen Trigger:
                    </Text>
                    <View className="flex-row flex-wrap gap-1 mb-2">
                      {uniqueAllergens.map((a, idx) => (
                        <View
                          key={idx}
                          className="bg-[#FFA4A4] px-3 py-1 rounded-xl"
                        >
                          <Text className="font-Poppins text-black">
                            {capitalizeFirstLetter(a)}
                          </Text>
                        </View>
                      ))}
                    </View>
                    <Text
                      className="font-Poppins"
                      style={{ flexWrap: "wrap", width: "100%" }}
                    >
                      Please read all labels carefully and consult with a
                      healthcare provider if you have any concerns.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          <View className="flex-row gap-2 bg-white px-4 py-4 border-t border-t-gray-100">
            <CustomButton
              bgVariant="outline"
              textVariant="primary"
              title="Discard"
              onPress={handleBack}
              disabled={loading}
            />
            <CustomButton
              title="Save"
              onPress={handleSave}
              loading={loading}
              disabled={loading}
            />
          </View>
        </View>

        {/* Bottom Sheets for Editing Macros */}
        <CaloriesBottomSheet
          bottomSheetRef={caloriesBottomSheetRef}
          currentValue={getMacroValue("calories", [
            "energy",
            "calories",
            "kcal",
          ])}
          onSave={handleSaveCalories}
          onClose={handleCloseCalories}
        />

        <CarbsBottomSheet
          bottomSheetRef={carbsBottomSheetRef}
          currentValue={getMacroValue("carbs", [
            "carbohydrate",
            "carbs",
            "total carbohydrate",
          ])}
          onSave={handleSaveCarbs}
          onClose={handleCloseCarbs}
        />

        <ProteinBottomSheet
          bottomSheetRef={proteinBottomSheetRef}
          currentValue={getMacroValue("protein", ["protein", "total protein"])}
          onSave={handleSaveProtein}
          onClose={handleCloseProtein}
        />

        <FatsBottomSheet
          bottomSheetRef={fatsBottomSheetRef}
          currentValue={getMacroValue("fats", [
            "fat",
            "total fat",
            "fats",
            "lipid",
          ])}
          onSave={handleSaveFats}
          onClose={handleCloseFats}
        />
      </View>
    </GestureHandlerRootView>
  );
}

export default memo(Results);

const styles = StyleSheet.create({
  saveButton: {},
});
