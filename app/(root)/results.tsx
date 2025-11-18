import AllergenSafeBadge from "@/components/AllergenSafeBadge";
import AllergenWarningBanner from "@/components/AllergenWarningBanner";
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
  getMacroValue,
  removeDuplicateTriggeredAllergens,
  setPrecisionIfNotInteger,
} from "@/utils/helpers";
import { cancelMealNotificationForDate } from "@/utils/notif";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import BottomSheet from "@gorhom/bottom-sheet";
import { router, useLocalSearchParams } from "expo-router";
import { memo, useCallback, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  const { setUser, user } = useAuth();
  const { image, name, scanResult, mealTime } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const parsedResult = scanResult
    ? (JSON.parse(scanResult as string) as ScanResultType & {
        quantity?: number;
      })
    : null;
  const initialQuantity = parsedResult?.quantity || 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [result, setResult] = useState<ScanResultType | null>(parsedResult);
  const [quantityInput, setQuantityInput] = useState(
    initialQuantity.toString()
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

  console.log("Meal Time results:", mealTime);

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
    // Validate quantity - check both state and input
    if (
      quantityInput.trim() === "" ||
      quantity < 1 ||
      !Number.isInteger(quantity)
    ) {
      Alert.alert(
        "Invalid Quantity",
        "Quantity must be a whole number and at least 1."
      );
      return;
    }

    console.log("Final Result to Save:", result);
    const allNutritionItems = result?.nutritionData.flatMap(
      (category) => category.items
    );

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

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const date = `${year}-${month}-${day}`;

    const mealRecordPayload: ScanResultType & { quantity: number } = {
      ...(result as ScanResultType),
      quantity,
      id: Date.now(), // use unique timestamp as ID
    };

    console.log("Meal Record Payload:", mealRecordPayload);

    // Save the result or perform any action
    const dietHistoryPayload: DietHistory = {
      date,
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

      if (meal === "breakfast") {
        await cancelMealNotificationForDate("breakfast", new Date());
      } else if (meal === "lunch") {
        await cancelMealNotificationForDate("lunch", new Date());
      } else if (meal === "dinner") {
        await cancelMealNotificationForDate("dinner", new Date());
      }

      alert("Successfully saved results.");
      router.replace("/(root)/(tabs)/home");
    } catch (error) {
      console.log("Error saving results:", error);
      alert("Error saving results. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [quantityInput, quantity, result, setUser, router]);

  const applyQuantityChange = useCallback(
    (updater: (previous: number) => number) => {
      setQuantity((prevQ) => {
        const requested = updater(prevQ);
        const targetValue = Number.isFinite(requested) ? requested : prevQ;
        const sanitized = Math.max(1, Math.round(targetValue));

        if (prevQ === sanitized) {
          setQuantityInput(sanitized.toString());
          return prevQ;
        }

        setResult((p) => {
          if (!p) return p;
          return {
            ...p,
            nutritionData: p.nutritionData.map((category) => ({
              ...category,
              items: category.items.map((item) => ({
                ...item,
                value: (Number(item.value) / prevQ) * sanitized,
              })),
            })),
          };
        });

        setQuantityInput(sanitized.toString());
        return sanitized;
      });
    },
    []
  );

  const handleDecreaseQuantity = useCallback(() => {
    applyQuantityChange((prevQ) => prevQ - 1);
  }, [applyQuantityChange]);

  const handleIncreaseQuantity = useCallback(() => {
    applyQuantityChange((prevQ) => prevQ + 1);
  }, [applyQuantityChange]);

  const handleQuantityInputChange = useCallback(
    (value: string) => {
      const numericOnly = value.replace(/[^0-9]/g, "");
      setQuantityInput(numericOnly);

      if (numericOnly === "") {
        return;
      }

      const numericValue = Number(numericOnly);
      if (!Number.isNaN(numericValue)) {
        applyQuantityChange(() => numericValue);
      }
    },
    [applyQuantityChange]
  );

  const handleQuantityInputBlur = useCallback(() => {
    if (quantityInput === "") {
      setQuantityInput(quantity.toString());
    }
  }, [quantityInput, quantity]);

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
        {image && (
          <Image
            source={{ uri: image as string }}
            style={{ height: 300, width: "100%" }}
            resizeMode="cover"
          />
        )}
        {/* Header */}
        {image && (
          <TouchableOpacity
            className="absolute left-4 right-0 top-4 w-10 h-10 rounded-full bg-black/50 z-10 items-center justify-center"
            onPress={handleBack}
          >
            <View className="items-center justify-center">
              <Feather name="chevron-left" size={18} color="white" />
            </View>
          </TouchableOpacity>
        )}

        <View
          className={`flex-1 bg-white ${image ? "mt-[-24px]" : "mt-0"} ${!image ? "pt-4" : ""}`}
        >
          {/* Date/Time */}
          {/* Quantity */}
          <View
            className={`flex-row items-center p-4 ${!image ? "justify-start gap-3" : "justify-between"}`}
          >
            {!image && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                onPress={handleBack}
              >
                <Feather name="chevron-left" size={20} color="black" />
              </TouchableOpacity>
            )}
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

            <View
              className={`flex-row items-center justify-center gap-5 ${!image ? "ml-auto" : ""}`}
            >
              <TouchableOpacity
                className="w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center"
                onPress={handleDecreaseQuantity}
              >
                <AntDesign name="minus" size={20} color="black" />
              </TouchableOpacity>
              <TextInput
                className="w-8 text-xl text-black font-PoppinsMedium text-center"
                value={quantityInput}
                onChangeText={handleQuantityInputChange}
                onBlur={handleQuantityInputBlur}
                keyboardType="number-pad"
                inputMode="numeric"
                maxLength={3}
                selectTextOnFocus
                accessibilityLabel="Set quantity"
              />
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

            {/* Allergen Warning Banner - Most Prominent Position */}
            {result.triggeredAllergens.length > 0 ? (
              <AllergenWarningBanner
                triggeredAllergens={result.triggeredAllergens}
                severity={
                  result.triggeredAllergens.length >= 3
                    ? "critical"
                    : "moderate"
                }
                onViewAlternatives={() => {
                  // TODO: Implement view alternatives functionality
                  console.log("View alternatives");
                }}
                onReportIncorrect={() => {
                  // TODO: Implement report incorrect functionality
                  console.log("Report incorrect");
                }}
              />
            ) : user?.allergens && user.allergens.length > 0 ? (
              <AllergenSafeBadge variant="prominent" />
            ) : null}

            {/* Food Name */}
            <Typo
              size={28}
              className="text-gray-900 mb-6"
              style={{
                fontFamily: "GeistSemiBold",
              }}
            >
              {`${capitalizeFirstLetter(result.name || result.foodName || "")} ${!result.brand ? "" : result.brand?.toLowerCase() === "unknown" ? "" : `(${result.brand})`}`}
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
                  {getMacroValue(
                    "calories",
                    ["energy", "calories", "kcal"],
                    result
                  )}{" "}
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
                  {getMacroValue(
                    "carbs",
                    ["carbohydrate", "carbs", "total carbohydrate"],
                    result
                  )}
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
                  {getMacroValue(
                    "protein",
                    ["protein", "total protein"],
                    result
                  )}
                  g
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
                  {getMacroValue(
                    "fats",
                    ["fat", "total fat", "fats", "lipid"],
                    result
                  )}
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
                            {setPrecisionIfNotInteger(item.value)}
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
                {result.barcode ? (
                  <Text className="font-PoppinsSemiBold text-3xl">
                    Ingredients
                  </Text>
                ) : (
                  <>
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
                  </>
                )}
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
                          barcode={result.barcode}
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
              {/* <View className="mx-4 mb-4">
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
              </View> */}
            </View>

            {/* Old allergen section removed - now using prominent banner at top */}
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
              disabled={
                loading ||
                quantityInput.trim() === "" ||
                quantity < 1 ||
                !Number.isInteger(quantity)
              }
            />
          </View>
        </View>

        {/* Bottom Sheets for Editing Macros */}
        <CaloriesBottomSheet
          bottomSheetRef={caloriesBottomSheetRef}
          currentValue={getMacroValue(
            "calories",
            ["energy", "calorie", "kcal"],
            result
          )}
          onSave={handleSaveCalories}
          onClose={handleCloseCalories}
        />

        <CarbsBottomSheet
          bottomSheetRef={carbsBottomSheetRef}
          currentValue={getMacroValue(
            "carbs",
            ["carbohydrate", "carbs", "total carbohydrate"],
            result
          )}
          onSave={handleSaveCarbs}
          onClose={handleCloseCarbs}
        />

        <ProteinBottomSheet
          bottomSheetRef={proteinBottomSheetRef}
          currentValue={getMacroValue(
            "protein",
            ["protein", "total protein"],
            result
          )}
          onSave={handleSaveProtein}
          onClose={handleCloseProtein}
        />

        <FatsBottomSheet
          bottomSheetRef={fatsBottomSheetRef}
          currentValue={getMacroValue(
            "fats",
            ["fat", "total fat", "fats", "lipid"],
            result
          )}
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
