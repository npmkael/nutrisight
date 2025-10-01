import { AddMeal } from "@/components/add-meal";
import { CustomCircularProgress } from "@/components/custom-circular-progress";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Progress } from "@/components/line-progress";
import { DietHistory, useAuth } from "@/context/AuthContext";
import { colors } from "@/lib/utils";
import { calorieSum, getPartOfDay } from "@/utils/helpers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { navigate } from "expo-router/build/global-state/routing";
import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  const sumMealCalories = useCallback(
    (meals?: { calorie?: number }[]) =>
      meals?.reduce((sum, meal) => sum + Number(meal.calorie || 0), 0),
    []
  );

  // Get calories for each meal from dietHistory
  const breakfastCalories = sumMealCalories(dietHistory?.breakfast) || 0;
  const lunchCalories = sumMealCalories(dietHistory?.lunch) || 0;
  const dinnerCalories = sumMealCalories(dietHistory?.dinner) || 0;
  const otherCalories = sumMealCalories(dietHistory?.otherMealTime) || 0;

  useEffect(() => {
    if (user && user.dailyRecommendation?.calories) {
      // Calculate percentages
      const totalLoggedCalories =
        breakfastCalories + lunchCalories + dinnerCalories + otherCalories;

      setTargetCalories(
        user.dailyRecommendation.calories - totalLoggedCalories
      );
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
    if (user) {
      // get the user's diet history date
      const userDietHistory = user.dietHistory?.find((h) =>
        isSameLocalDate(h.date, selectedDate)
      );
      setDietHistory(userDietHistory || null);

      if (Array.isArray(userDietHistory?.nutritionalData)) {
        // Get the first (and only) object in the array
        const nutritionObj = userDietHistory.nutritionalData[0];

        // Helper to sum all keys that include a keyword
        const sumByKeyword = (obj: Record<string, number>, keyword: string) =>
          Object.entries(obj)
            .filter(([key]) => key.toLowerCase().includes(keyword))
            .reduce((sum, [, value]) => sum + Number(value || 0), 0);

        const carbs = sumByKeyword(nutritionObj, "carb");
        const protein = sumByKeyword(nutritionObj, "protein");
        const fats = sumByKeyword(nutritionObj, "fat");

        setMacros({
          carbs: Number(carbs.toFixed(2)),
          protein: Number(protein.toFixed(2)),
          fats: Number(fats.toFixed(2)),
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
                calorieGoal={Math.round(targetCalories)}
                progress={
                  (breakfastCalories +
                    lunchCalories +
                    dinnerCalories +
                    otherCalories >
                  targetCalories
                    ? targetCalories
                    : (breakfastCalories +
                        lunchCalories +
                        dinnerCalories +
                        otherCalories) /
                      targetCalories) * 100
                }
              />
            </View>
          </View>

          <View className="flex-col mt-6">
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
                  {macros?.carbs.toFixed(2) || 0}g
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
                  {macros?.protein.toFixed(2) || 0}g
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
                  {macros?.fats.toFixed(2) || 0}g
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
          <AddMeal
            title="Breakfast"
            totalCalories={0.25 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={Number(
              calorieSum(dietHistory?.breakfast || []).toFixed(2)
            )}
            disabled={!isToday}
          />
          <AddMeal
            title="Lunch"
            totalCalories={0.35 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={Number(
              calorieSum(dietHistory?.lunch || []).toFixed(2)
            )}
            disabled={!isToday}
          />
          <AddMeal
            title="Dinner"
            totalCalories={0.3 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={Number(
              calorieSum(dietHistory?.dinner || []).toFixed(2)
            )}
            disabled={!isToday}
          />
          <AddMeal
            title="Snacks"
            totalCalories={0.1 * (user.dailyRecommendation?.calories || 0)}
            caloriesConsumed={Number(
              calorieSum(dietHistory?.otherMealTime || []).toFixed(2)
            )}
            disabled={false}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton />
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
