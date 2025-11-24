import { AddMeal } from "@/components/add-meal";
import { CustomCircularProgress } from "@/components/custom-circular-progress";
import FloatingActionButton from "@/components/FloatingActionButton";
import FoodRecommendationCard from "@/components/FoodRecommendationCard";
import { Progress } from "@/components/line-progress";
import { DietHistory, useAuth } from "@/context/AuthContext";
import { useFoodRecommendations } from "@/hooks/useFoodRecommendations";
import { colors } from "@/lib/utils";
import {
  calorieSum,
  getCaloriesFromMealEntry,
  getPartOfDay,
  setPrecisionIfNotInteger,
} from "@/utils/helpers";
import {
  cancelMealNotificationForDate,
  ensureRollingScheduledReminders,
} from "@/utils/notif";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  ScrollView as RNScrollView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BREAKFAST_START = 6 * 60; // 360 (06:00)
const BREAKFAST_END = 10 * 60; // 600 (10:00)

const LUNCH_START = 12 * 60; // 720 (12:00)
const LUNCH_END = 14 * 60; // 840 (14:00)

const DINNER_START = 18 * 60; // 1080 (18:00)
const DINNER_END = 21 * 60; // 1260 (21:00)

function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dietHistory, setDietHistory] = useState<DietHistory | null>(null);
  const [macros, setMacros] = useState<{
    carbs: number;
    protein: number;
    fats: number;
  } | null>(null);
  const [targetCalories, setTargetCalories] = useState<number>(0);

  const {
    recommendations: foodRecommendations,
    loading: recommendationsLoading,
    error: recommendationsError,
    refetch: refetchRecommendations,
  } = useFoodRecommendations();

  const featuredRecommendation = useMemo(() => {
    if (!foodRecommendations.length) return null;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    let mealType: "breakfast" | "lunch" | "dinner" | null = null;

    // Determine meal type based on time ranges
    if (currentMinutes >= BREAKFAST_START && currentMinutes < BREAKFAST_END) {
      mealType = "breakfast";
    } else if (currentMinutes >= LUNCH_START && currentMinutes < LUNCH_END) {
      mealType = "lunch";
    } else if (currentMinutes >= DINNER_START && currentMinutes < DINNER_END) {
      mealType = "dinner";
    }

    // Filter recommendations matching the current meal type
    if (mealType) {
      let matchingRecommendations = foodRecommendations.filter(
        (r) => r.mealTime === mealType
      );

      // If we have matching recommendations, pick a random one
      if (matchingRecommendations.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * matchingRecommendations.length
        );
        return matchingRecommendations[randomIndex];
      }
    }

    // Prefer snack recommendations as the default fallback
    const snackRecommendations = foodRecommendations.filter(
      (r) => (r.mealTime || "").toLowerCase() === "snack"
    );
    if (snackRecommendations.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * snackRecommendations.length
      );
      return snackRecommendations[randomIndex];
    }

    // Fallback to a random recommendation from all available
    const randomIndex = Math.floor(Math.random() * foodRecommendations.length);
    return foodRecommendations[randomIndex];
  }, [foodRecommendations]);

  const recommendationLabel = useMemo(() => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (currentMinutes >= BREAKFAST_START && currentMinutes < BREAKFAST_END) {
      return "Breakfast pick";
    } else if (currentMinutes >= LUNCH_START && currentMinutes < LUNCH_END) {
      return "Lunch pick";
    } else if (currentMinutes >= DINNER_START && currentMinutes < DINNER_END) {
      return "Dinner pick";
    }
    return "Today's pick";
  }, []);

  const [showGuideModal, setShowGuideModal] = useState(false);
  const [guidePage, setGuidePage] = useState<number>(0);

  useEffect(() => {
    // Refetch recommendations when user profile changes
    if (user) {
      refetchRecommendations();
    }
  }, [user, refetchRecommendations]);

  const sumMealCalories = useCallback(
    (meals?: { calorie?: number }[]) =>
      meals?.reduce((sum, meal) => sum + Number(meal.calorie || 0), 0),
    []
  );

  // Get calories for each meal from dietHistory
  const breakfastCalories =
    sumMealCalories(
      (dietHistory?.breakfast ?? []).map((b) => ({
        calorie: getCaloriesFromMealEntry(b),
      }))
    ) || 0;
  const lunchCalories =
    sumMealCalories(
      (dietHistory?.lunch ?? []).map((l) => ({
        calorie: getCaloriesFromMealEntry(l),
      }))
    ) || 0;
  const dinnerCalories =
    sumMealCalories(
      (dietHistory?.dinner ?? []).map((d) => ({
        calorie: getCaloriesFromMealEntry(d),
      }))
    ) || 0;
  const otherCalories =
    sumMealCalories(
      (dietHistory?.otherMealTime ?? []).map((o) => ({
        calorie: getCaloriesFromMealEntry(o),
      }))
    ) || 0;

  useEffect(() => {
    if (user && user.dailyRecommendation?.calories) {
      // Calculate remaining calories
      const totalLoggedCalories =
        breakfastCalories + lunchCalories + dinnerCalories + otherCalories;

      const remaining = user.dailyRecommendation.calories - totalLoggedCalories;
      // Don't show negative values, show 0 if exceeded
      setTargetCalories(Math.max(0, remaining));
    }
  }, [user, breakfastCalories, lunchCalories, dinnerCalories, otherCalories]);

  // Compare two dates by local year/month/day to avoid UTC shift issues
  const isSameLocalDate = useCallback((a: Date | string, b: Date | string) => {
    const da = new Date(a);
    const db = new Date(b);
    return (
      da.getFullYear() === db.getFullYear() &&
      da.getMonth() === db.getMonth() &&
      da.getDate() === db.getDate()
    );
  }, []);

  useEffect(() => {
    // create/maintain at least 3 and at most 7 days scheduled for each meal
    (async () => {
      if (!user) return;
      const today = new Date();

      await ensureRollingScheduledReminders(
        "breakfast",
        8,
        0,
        3,
        7,
        "Breakfast time",
        "You haven't logged breakfast yet."
      );
      await ensureRollingScheduledReminders(
        "lunch",
        12,
        0,
        3,
        7,
        "Lunch time",
        "You haven't logged lunch yet."
      );
      await ensureRollingScheduledReminders(
        "dinner",
        20,
        0,
        3,
        7,
        "Dinner time",
        "You haven't logged dinner yet."
      );

      const todaysEntry = user.dietHistory?.find((h) =>
        isSameLocalDate(h.date, today)
      );
      if (todaysEntry) {
        if (
          Array.isArray(todaysEntry.breakfast) &&
          todaysEntry.breakfast.length > 0
        ) {
          await cancelMealNotificationForDate("breakfast", today);
        }
        if (Array.isArray(todaysEntry.lunch) && todaysEntry.lunch.length > 0) {
          await cancelMealNotificationForDate("lunch", today);
        }
        if (
          Array.isArray(todaysEntry.dinner) &&
          todaysEntry.dinner.length > 0
        ) {
          await cancelMealNotificationForDate("dinner", today);
        }
      }
    })();
  }, [user]);

  useEffect(() => {
    if (user) {
      // get the user's diet history date
      const userDietHistory = user.dietHistory?.find((h) =>
        isSameLocalDate(h.date, selectedDate)
      );
      setDietHistory(userDietHistory || null);

      if (userDietHistory) {
        // Extract nutritional data from breakfast, lunch, dinner, otherMealTime
        // and sum them up
        const allMeals = [
          ...(userDietHistory.breakfast.map((b) =>
            b.nutritionData.map((i) => i.items.flatMap((f) => f) || [])
          ) || []),
          ...(userDietHistory.lunch.map((l) =>
            l.nutritionData.map((i) => i.items.flatMap((f) => f) || [])
          ) || []),
          ...(userDietHistory.dinner.map((d) =>
            d.nutritionData.map((i) => i.items.flatMap((f) => f) || [])
          ) || []),
          ...(userDietHistory.otherMealTime.map((o) =>
            o.nutritionData.map((i) => i.items.flatMap((f) => f) || [])
          ) || []),
        ];

        const allNutritionItems = allMeals.flat(3); // flatten to get all items
        const nutritionObj: Record<string, number> = {};
        allNutritionItems.forEach((item) => {
          const name = (item.name as string).toLowerCase();
          const value = Number(item.value) || 0;
          if (name in nutritionObj) {
            nutritionObj[name] += value;
          } else {
            nutritionObj[name] = value;
          }
        });

        // Helper to sum all keys that include a keyword
        const sumByKeyword = (obj: Record<string, number>, keyword: string) =>
          Object.entries(obj)
            .filter(([key]) => key.toLowerCase().includes(keyword))
            .reduce((sum, [, value]) => sum + Number(value || 0), 0);

        const carbs = sumByKeyword(nutritionObj, "carb");
        const protein = sumByKeyword(nutritionObj, "protein");
        const fats = sumByKeyword(nutritionObj, "fat");

        setMacros({
          carbs: setPrecisionIfNotInteger(carbs),
          protein: setPrecisionIfNotInteger(protein),
          fats: setPrecisionIfNotInteger(fats),
        });
      } else {
        setMacros({
          carbs: 0,
          protein: 0,
          fats: 0,
        });
      }
    }
  }, [selectedDate, user]);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const totalLoggedCalories =
    breakfastCalories + lunchCalories + dinnerCalories + otherCalories;

  const belowRecommendation = useMemo(() => {
    const dr = user?.dailyRecommendation as any;
    if (!dr || !dr.calories) return false;
    // Consider 'below' if logged calories are less than 70% of daily recommendation
    return totalLoggedCalories < 0.7 * dr.calories;
  }, [user, totalLoggedCalories]);

  const exceededRecommendations = useMemo(() => {
    const exceeded: Array<{
      key: string;
      label: string;
      amount: number;
      unit: string;
    }> = [];
    const dr = user?.dailyRecommendation as any;
    if (!dr) return exceeded;

    if (dr.calories && totalLoggedCalories > dr.calories) {
      exceeded.push({
        key: "calories",
        label: "Calories",
        amount: totalLoggedCalories - dr.calories,
        unit: "kcal",
      });
    }

    if (dr.protein && (macros?.protein || 0) > dr.protein) {
      exceeded.push({
        key: "protein",
        label: "Protein",
        amount: (macros?.protein || 0) - dr.protein,
        unit: "g",
      });
    }

    if (dr.carbs && (macros?.carbs || 0) > dr.carbs) {
      exceeded.push({
        key: "carbs",
        label: "Carbs",
        amount: (macros?.carbs || 0) - dr.carbs,
        unit: "g",
      });
    }

    if (dr.fat && (macros?.fats || 0) > dr.fat) {
      exceeded.push({
        key: "fat",
        label: "Fats",
        amount: (macros?.fats || 0) - dr.fat,
        unit: "g",
      });
    }

    return exceeded;
  }, [user, totalLoggedCalories, macros]);

  const exceedText = useMemo(() => {
    if (!exceededRecommendations || exceededRecommendations.length === 0)
      return "";
    const parts = exceededRecommendations.map((e) => {
      const amt = setPrecisionIfNotInteger(Number(e.amount || 0));
      if (e.key === "calories") return `${amt}${e.unit}`;
      return `${amt}${e.unit} ${e.label}`;
    });
    if (parts.length === 1) return `You exceeded ${parts[0]}.`;
    return `You exceeded ${parts.join(", ")}.`;
  }, [exceededRecommendations]);

  const [showExceededWarning, setShowExceededWarning] = useState(false);

  useEffect(() => {
    if (exceededRecommendations.length > 0) {
      setShowExceededWarning(true);
    } else {
      setShowExceededWarning(false);
    }
  }, [exceededRecommendations]);

  const consumedPercent = useCallback(
    (consumed: number | undefined, recommended: number | undefined) => {
      const c = Number(consumed || 0);
      const r = Number(recommended || 0);
      if (r <= 0) return 0;
      const pct = Math.round((c / r) * 100);
      return Math.max(0, Math.min(100, pct));
    },
    []
  );

  // Generate 7 days starting from current week
  const generateWeekDays = useCallback(() => {
    const today = new Date();
    const startDate = new Date(selectedDate);

    // Get the start of the week (Sunday) for the selected date
    const dayOfWeek = startDate.getDay();
    const startOfWeek = new Date(startDate);
    startOfWeek.setDate(startDate.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);

      const dayName = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
      });
      const dayNumber = currentDate.getDate().toString().padStart(2, "0");
      const isToday = currentDate.toDateString() === today.toDateString();
      const isSelected =
        currentDate.toDateString() === selectedDate.toDateString();

      days.push({
        date: currentDate,
        day: dayName,
        dateNum: dayNumber,
        isToday,
        isSelected,
      });
    }
    return days;
  }, [selectedDate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const navigateWeek = useCallback(
    (direction: "prev" | "next") => {
      const newDate = new Date(selectedDate);
      const daysToAdd = direction === "next" ? 7 : -7;
      newDate.setDate(selectedDate.getDate() + daysToAdd);
      setSelectedDate(newDate);
    },
    [selectedDate]
  );

  const formatSelectedDate = useCallback((date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return (
        "TODAY, " +
        date
          .toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
          .toUpperCase()
      );
    }

    return date
      .toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .toUpperCase();
  }, []);

  if (!user) {
    router.replace("/(auth)/sign-in");
    return null;
  }

  return (
    <SafeAreaView
      className="bg-[#F3F4F7] flex-1 justify-center relative"
      edges={["top"]}
    >
      {/* <StatusBar backgroundColor={colors.primary} style="auto" /> */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 50 }}
      >
        {/* Custom Background */}
        <View style={styles.upperContainer} />

        {/* Header */}
        <View className="flex-row items-center justify-between absolute top-5 left-0 right-0 px-4">
          <View className="flex-row items-center gap-4">
            <View>
              <Image
                source={
                  user.profileLink
                    ? { uri: user.profileLink }
                    : require("@/assets/images/default-profile.jpg")
                }
                className="w-10 h-10 rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="justify-center">
              <Text
                className="text-white text-lg"
                style={{
                  fontFamily: "Poppins",
                  lineHeight: 14,
                }}
              >
                Hello {user.name},
              </Text>
              <Text
                className="text-white text-2xl"
                style={{
                  fontFamily: "PoppinsSemiBold",
                }}
              >
                Good {getPartOfDay(new Date().getHours())}
              </Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowGuideModal(true)}
              className="p-2 bg-slate-50 rounded-full border border-gray-300 mr-2"
              accessibilityLabel="Open daily intake guide"
            >
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#666"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigate("/(root)/(tabs)/settings")}
              className="p-2 bg-slate-50 rounded-full border border-gray-300"
            >
              <Ionicons name="settings" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        <View className="bg-transparent p-4 rounded-lg mx-4 absolute left-0 right-0 top-[70px] z-10">
          <View className="items-center flex-row justify-center">
            <View>
              <CustomCircularProgress
                consumedCalories={
                  breakfastCalories +
                  lunchCalories +
                  dinnerCalories +
                  otherCalories
                }
                targetCalories={user.dailyRecommendation?.calories || 0}
                progress={Math.min(
                  100,
                  ((breakfastCalories +
                    lunchCalories +
                    dinnerCalories +
                    otherCalories) /
                    (user.dailyRecommendation?.calories || 1)) *
                    100
                )}
              />
            </View>
          </View>

          <View className="flex-col mt-12">
            <View>
              <Text className="text-white text-xs font-Poppins text-center mb-4">
                Nutritional Content Summary
              </Text>
            </View>

            <View className="flex-row justify-evenly px-4">
              {/* Carbs */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  CARBS
                </Text>
                <View className="w-16">
                  <Progress
                    min={consumedPercent(
                      macros?.carbs,
                      user.dailyRecommendation?.carbs
                    )}
                    max={100}
                    height={2}
                    color="#30B0C7"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">
                  {setPrecisionIfNotInteger(macros?.carbs || 0)} g
                </Text>
              </View>

              {/* Protein */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  PROTEIN
                </Text>
                <View className="w-16">
                  <Progress
                    min={consumedPercent(
                      macros?.protein,
                      user.dailyRecommendation?.protein
                    )}
                    max={100}
                    height={2}
                    color="#FFD700"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">
                  {setPrecisionIfNotInteger(macros?.protein || 0)} g
                </Text>
              </View>

              {/* Fats */}
              <View className="flex-col items-center justify-center gap-1">
                <Text className="text-white text-xs font-Poppins text-center uppercase tracking-wider">
                  FATS
                </Text>
                <View className="w-16">
                  <Progress
                    min={consumedPercent(
                      macros?.fats,
                      user.dailyRecommendation?.fat
                    )}
                    max={100}
                    height={2}
                    color="#FF6B6B"
                    backgroundColor="rgba(255, 255, 255, 0.3)"
                  />
                </View>
                <Text className="text-white text-sm font-Poppins">
                  {setPrecisionIfNotInteger(macros?.fats || 0)} g
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Calendar Strip */}
        <View className="bg-transparent mx-4 mt-6 rounded-lg absolute left-0 right-0 top-[350px] z-10">
          {/* Header with month/year and navigation */}
          <View className="flex-row items-center justify-between px-4 border-b border-gray-100">
            <TouchableOpacity
              className="p-1"
              onPress={() => navigateWeek("prev")}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>

            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text className="text-gray-700 font-PoppinsSemiBold text-sm">
                {formatSelectedDate(selectedDate)}
              </Text>
            </View>

            <TouchableOpacity
              className="p-1"
              onPress={() => navigateWeek("next")}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Days of week */}
          <View className="flex-row justify-between px-4 py-3">
            {generateWeekDays().map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDateSelect(item.date)}
                className={`items-center justify-center w-10 h-16 rounded-lg ${
                  item.isSelected
                    ? "bg-white border border-black rounded-[15px]"
                    : ""
                }`}
                activeOpacity={0.7}
              >
                <Text
                  className={`text-xs font-Poppins mb-1 ${
                    item.isSelected ? "text-black" : "text-gray-400"
                  }`}
                >
                  {item.day}
                </Text>
                <Text
                  className={`text-lg font-Poppins ${
                    item.isSelected ? "text-black" : "text-gray-400"
                  }`}
                >
                  {item.dateNum}
                </Text>

                <View
                  className={`w-1 h-1 ${
                    item.isToday ? "bg-black" : "bg-transparent"
                  } rounded-full mt-1`}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add Food Button */}

        <View className="flex-col gap-2 mx-4 mt-[470px]">
          {/* Persistent exceed-warning banner: appears when any daily recommendation is exceeded and stays until closed */}
          {showExceededWarning && exceededRecommendations.length > 0 && (
            <View className="mx-4 mt-2">
              <View className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md flex-row items-start">
                <View className="flex-1 pr-2">
                  <Text className="text-yellow-800 font-PoppinsSemiBold">
                    Warning
                  </Text>
                  <Text className="text-yellow-800 text-sm">{exceedText}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowExceededWarning(false)}
                  className="p-2"
                  accessibilityLabel="Close warning"
                >
                  <Ionicons name="close" size={18} color="#92400E" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <AddMeal
            title="Breakfast"
            totalCalories={0.25 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={setPrecisionIfNotInteger(
              calorieSum(dietHistory?.breakfast || [])
            )}
            disabled={!isToday}
            date={selectedDate.toISOString()}
          />
          <AddMeal
            title="Lunch"
            totalCalories={0.35 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={setPrecisionIfNotInteger(
              calorieSum(dietHistory?.lunch || [])
            )}
            disabled={!isToday}
            date={selectedDate.toISOString()}
          />
          <AddMeal
            title="Dinner"
            totalCalories={0.3 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={setPrecisionIfNotInteger(
              calorieSum(dietHistory?.dinner || [])
            )}
            disabled={!isToday}
            date={selectedDate.toISOString()}
          />
          <AddMeal
            title="Snacks"
            totalCalories={0.1 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={setPrecisionIfNotInteger(
              calorieSum(dietHistory?.otherMealTime || [])
            )}
            disabled={!isToday}
            date={selectedDate.toISOString()}
          />

          {/* Food Recommendation Banner */}
          <View className="mt-4">
            <FoodRecommendationCard
              recommendation={featuredRecommendation}
              isLoading={recommendationsLoading}
              error={recommendationsError}
              onPress={() => router.push("/(root)/meal-plan")}
              accentLabel={recommendationLabel}
            />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton />
      {/* Daily Intake Guide Modal */}
      <Modal
        visible={showGuideModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowGuideModal(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-xl p-4 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-PoppinsSemiBold">
                Daily Intake Guide
              </Text>
              <TouchableOpacity onPress={() => setShowGuideModal(false)}>
                <Ionicons name="close" size={22} color="#666" />
              </TouchableOpacity>
            </View>
            <RNScrollView showsVerticalScrollIndicator={false}>
              {/* Page 0: Quick summary + shortfall explanation */}
              {guidePage === 0 && (
                <View className="mb-4 px-1">
                  <Text className="text-2xl font-PoppinsSemiBold mb-3">
                    Quick summary
                  </Text>
                  {exceededRecommendations.length > 0 ? (
                    <Text className="text-lg text-red-700">{exceedText}</Text>
                  ) : belowRecommendation ? (
                    <Text className="text-lg text-blue-700">
                      You're below your daily calorie target — a small,
                      nutrient-dense snack (protein + carb) can help bring you
                      closer to your daily goal without overdoing it.
                    </Text>
                  ) : (
                    <Text className="text-lg text-green-700">
                      You're inside your target range — keep balanced meals and
                      stay hydrated to maintain steady progress.
                    </Text>
                  )}
                </View>
              )}

              {/* Page 1: What happens next */}
              {guidePage === 1 && (
                <View className="mb-4 px-1">
                  <Text className="text-2xl font-PoppinsSemiBold mb-4">
                    What happens next
                  </Text>

                  <View className="bg-yellow-50 p-3 rounded-lg mb-3">
                    <View className="flex-row items-start gap-3">
                      <Ionicons
                        name="alert-circle-outline"
                        size={22}
                        color="#92400E"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-lg font-PoppinsSemiBold mb-1"
                          style={{ lineHeight: 26 }}
                        >
                          Home banner
                        </Text>
                        <Text
                          className="text-md text-yellow-900"
                          style={{ lineHeight: 22 }}
                        >
                          If you exceed targets, a persistent warning appears on
                          Home until you close it. It stays subtle but visible.
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="bg-slate-50 p-3 rounded-lg mb-3">
                    <View className="flex-row items-start gap-3">
                      <Ionicons name="save-outline" size={22} color="#0F172A" />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-lg font-PoppinsSemiBold mb-1"
                          style={{ lineHeight: 26 }}
                        >
                          Save behavior
                        </Text>
                        <Text
                          className="text-md text-slate-800"
                          style={{ lineHeight: 22 }}
                        >
                          If saving a new scan would increase an exceedance, the
                          Results screen blocks Save so you can review and
                          adjust before confirming.
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="bg-white p-3 rounded-lg border border-gray-100 mb-3">
                    <View className="flex-row items-start gap-3">
                      <Ionicons
                        name="create-outline"
                        size={22}
                        color="#0EA5A4"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-lg font-PoppinsSemiBold mb-1"
                          style={{ lineHeight: 26 }}
                        >
                          Editability
                        </Text>
                        <Text
                          className="text-md text-slate-800"
                          style={{ lineHeight: 22 }}
                        >
                          Scan results can be edited before you save them
                          (adjust portions or corrections on the Results
                          screen). To change items already logged, open the meal
                          from Home and delete or re-add entries — totals update
                          after you make changes.
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="p-3 rounded-lg">
                    <View className="flex-row items-start gap-3">
                      <Ionicons
                        name="information-circle"
                        size={22}
                        color="#334155"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-lg font-PoppinsSemiBold mb-1"
                          style={{ lineHeight: 26 }}
                        >
                          Guidance only
                        </Text>
                        <Text
                          className="text-sm text-gray-600"
                          style={{ lineHeight: 20 }}
                        >
                          Warnings are informational and meant to prompt review
                          — they are not a medical diagnosis. Consult a
                          clinician for personalized advice.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Page 2: Meal tips only (accessible card layout) */}
              {guidePage === 2 && (
                <View className="mb-4 px-1">
                  <Text className="text-2xl font-PoppinsSemiBold mb-4">
                    Meal tips
                  </Text>

                  <View className="space-y-4">
                    <View className="flex-row items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <Ionicons
                        name="sunny-outline"
                        size={28}
                        color="#0F172A"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-xl font-PoppinsSemiBold"
                          style={{ lineHeight: 28 }}
                        >
                          Breakfast
                        </Text>
                        <Text
                          className="text-md text-slate-700"
                          style={{ lineHeight: 22 }}
                        >
                          Protein + whole grain (eggs, oats) — a satisfying
                          start to your day.
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <Ionicons
                        name="restaurant-outline"
                        size={28}
                        color="#0F172A"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-xl font-PoppinsSemiBold"
                          style={{ lineHeight: 28 }}
                        >
                          Lunch
                        </Text>
                        <Text
                          className="text-md text-slate-700"
                          style={{ lineHeight: 22 }}
                        >
                          Protein + vegetables + whole grain — balanced energy
                          for the afternoon.
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <Ionicons name="moon-outline" size={28} color="#0F172A" />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-xl font-PoppinsSemiBold"
                          style={{ lineHeight: 28 }}
                        >
                          Dinner
                        </Text>
                        <Text
                          className="text-md text-slate-700"
                          style={{ lineHeight: 22 }}
                        >
                          Lighter carbs, vegetables, and lean protein — keep it
                          satisfying but not too heavy.
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start gap-3 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <Ionicons
                        name="nutrition-outline"
                        size={28}
                        color="#0F172A"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          className="text-xl font-PoppinsSemiBold"
                          style={{ lineHeight: 28 }}
                        >
                          Snacks
                        </Text>
                        <Text
                          className="text-md text-slate-700"
                          style={{ lineHeight: 22 }}
                        >
                          Go for simple, nutrient-dense options such as fruit,
                          nuts, or yogurt.
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Pager indicator */}
              <View className="flex-row justify-center items-center mt-2">
                {[0, 1, 2].map((i) => (
                  <View
                    key={i}
                    className={`w-2 h-2 rounded-full mx-1 ${
                      guidePage === i ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  />
                ))}
              </View>

              {/* Footer navigation */}
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={() => setGuidePage(Math.max(0, guidePage - 1))}
                  className={`px-4 py-2 rounded-md ${guidePage === 0 ? "opacity-50" : "bg-slate-100"}`}
                  disabled={guidePage === 0}
                >
                  <Text className="font-Poppins">Back</Text>
                </TouchableOpacity>

                {guidePage < 2 ? (
                  <TouchableOpacity
                    onPress={() => setGuidePage(Math.min(2, guidePage + 1))}
                    className="px-4 py-2 bg-gray-800 rounded-md"
                  >
                    <Text className="text-white font-PoppinsSemiBold">
                      Next
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setShowGuideModal(false);
                      setGuidePage(0);
                    }}
                    className="px-4 py-2 bg-gray-800 rounded-md"
                  >
                    <Text className="text-white font-PoppinsSemiBold">
                      Done
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </RNScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  upperContainer: {
    backgroundColor: colors.primary,
    position: "absolute",
    top: 0,
    left: -165,
    right: -165,
    height: 350,
    borderBottomLeftRadius: 350,
    borderBottomRightRadius: 350,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 20,
  },
  headerText: {
    fontFamily: "Poppins",
    fontSize: 28,
    color: "white",
  },
  progressText: {
    fontFamily: "Poppins",
    fontSize: 12,
    color: "#a0a0a0",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    backgroundColor: "#2D3644",
    position: "absolute",
    bottom: 20,
    right: 20,
    borderRadius: 50,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
});

export default memo(Home);
