import { Ionicons } from "@expo/vector-icons";
import React, { memo } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MacroNutrients {
  carbs: number;
  protein: number;
  fat: number;
}

interface MealEntry {
  id: string;
  time: string; // e.g., "08:00"
  title: string;
  calories: number;
  macros: MacroNutrients;
  icon: string; // icon name for Ionicons
  isLogged: boolean;
  mealType: string; // e.g., "Breakfast"
}

interface MealTimelineProps {
  meals: MealEntry[];
  onEditMeal?: (mealId: string) => void;
}

interface MealCardProps {
  meal: MealEntry;
  onEdit?: (mealId: string) => void;
}

// Individual meal card component
function MealCard({ meal, onEdit }: MealCardProps) {
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      {/* Meal item */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {/* Icon and status */}
          <View className="flex-row items-center mr-3">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
              <Ionicons name={meal.icon as any} size={16} color="#666" />
            </View>
            <View className="flex-row items-center">
              <Text className="text-sm font-PoppinsSemiBold text-gray-800 mr-2">
                {meal.calories} kcal
              </Text>
              {meal.isLogged && (
                <View className="w-4 h-4 bg-green-500 rounded-full items-center justify-center">
                  <Ionicons name="checkmark" size={10} color="white" />
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Edit button */}
        <TouchableOpacity
          onPress={() => onEdit?.(meal.id)}
          className="p-2"
          activeOpacity={0.7}
        >
          <Ionicons name="pencil" size={16} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Meal title */}
      <Text className="text-base font-PoppinsMedium text-gray-800 mt-2 mb-3">
        {meal.title}
      </Text>

      {/* Macronutrient breakdown */}
      <View className="flex-row items-center gap-1">
        {/* Protein - Blue */}
        <View className="flex-row items-center gap-1 bg-[#E7F1FF] p-1 rounded-full">
          <Image
            source={require("@/assets/icons/meat.png")}
            className="w-4 h-4"
          />
          <Text className="font-PoppinsMedium text-xs text-[#498FFD]">20g</Text>
        </View>

        {/* Carbs - Green */}
        <View className="flex-row items-center gap-1 bg-[#ebfce9] p-1 rounded-full">
          <Image
            source={require("@/assets/icons/carbs.png")}
            className="w-4 h-4"
          />
          <Text className="font-PoppinsMedium text-xs text-[#2BA660]">20g</Text>
        </View>

        {/* Fat - Yellow */}
        <View className="flex-row items-center gap-1 bg-[#F9F2DF] p-1 rounded-full">
          <Image
            source={require("@/assets/icons/protein.png")}
            className="w-4 h-4"
          />
          <Text className="font-PoppinsMedium text-xs text-[#F1AA17]">20g</Text>
        </View>
      </View>
    </View>
  );
}

function MealTimeline({ meals, onEditMeal }: MealTimelineProps) {
  // Define individual meal times
  const mealTimes = [
    { time: "06:00", displayTime: "6 AM", mealType: "Breakfast" },
    { time: "07:00", displayTime: "7 AM", mealType: "Breakfast" },
    { time: "08:00", displayTime: "8 AM", mealType: "Breakfast" },
    { time: "09:00", displayTime: "9 AM", mealType: "Breakfast" },
    { time: "10:00", displayTime: "10 AM", mealType: "Breakfast" },
    { time: "11:00", displayTime: "11 AM", mealType: "Breakfast" },
    { time: "12:00", displayTime: "12 PM", mealType: "Lunch" },
    { time: "13:00", displayTime: "1 PM", mealType: "Lunch" },
    { time: "14:00", displayTime: "2 PM", mealType: "Lunch" },
    { time: "15:00", displayTime: "3 PM", mealType: "Lunch" },
    { time: "16:00", displayTime: "4 PM", mealType: "Lunch" },
    { time: "17:00", displayTime: "5 PM", mealType: "Lunch" },
    { time: "18:00", displayTime: "6 PM", mealType: "Dinner" },
    { time: "19:00", displayTime: "7 PM", mealType: "Dinner" },
    { time: "20:00", displayTime: "8 PM", mealType: "Dinner" },
    { time: "21:00", displayTime: "9 PM", mealType: "Dinner" },
  ];

  // Generate time slots based on individual meal times
  const generateTimeSlots = () => {
    return mealTimes.map((mealTime) => {
      // Find meals for this specific time
      const mealsAtTime = meals.filter((meal) => meal.time === mealTime.time);

      return {
        time: mealTime.time,
        displayTime: mealTime.displayTime,
        mealType: mealTime.mealType,
        meals: mealsAtTime,
        hasActivity: mealsAtTime.length > 0,
      };
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <View className="flex-1 bg-[#F7F7F7]">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Breakfast Section */}
        <View className="px-5 mt-4">
          <Text className="text-xl font-PoppinsSemiBold text-gray-800">
            Breakfast
          </Text>
        </View>
        {timeSlots.slice(0, 6).map((slot, index) => (
          <View key={slot.time} className="flex-row px-5 py-2">
            {/* Timeline on the left */}
            <View className="w-16 items-center mr-4">
              {/* Time label with orange pill background if active */}
              <View
                className={`
                  px-2 py-1 rounded-full min-w-[50px] items-center
                  ${slot.hasActivity ? "bg-[#FCA251]" : "bg-transparent"}
                `}
              >
                <Text
                  className={`
                    text-sm font-PoppinsMedium
                    ${slot.hasActivity ? "text-white" : "text-gray-600"}
                  `}
                >
                  {slot.displayTime}
                </Text>
              </View>

              {/* Timeline dot and line */}
              {index < 5 && (
                <View className="items-center h-[70px] mt-2">
                  <View
                    className={`
                      w-2 h-2 rounded-full
                      ${slot.hasActivity ? "bg-[#FCA251]" : "bg-gray-300"}
                    `}
                  />
                  <View className="w-0.5 h-full bg-gray-200 mt-2" />
                </View>
              )}
            </View>

            {/* Content on the right */}
            <View className="flex-1">
              {slot.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onEdit={onEditMeal} />
              ))}
            </View>
          </View>
        ))}

        {/* Lunch Section */}
        <View className="px-5 py-3">
          <Text className="text-xl font-PoppinsSemiBold text-gray-800 mb-2">
            Lunch
          </Text>
        </View>
        {timeSlots.slice(6, 12).map((slot, index) => (
          <View key={slot.time} className="flex-row px-5 py-2">
            {/* Timeline on the left */}
            <View className="w-16 items-center mr-4">
              {/* Time label with orange pill background if active */}
              <View
                className={`
                  px-2 py-1 rounded-full min-w-[50px] items-center
                  ${slot.hasActivity ? "bg-[#FCA251]" : "bg-transparent"}
                `}
              >
                <Text
                  className={`
                    text-sm font-PoppinsMedium
                    ${slot.hasActivity ? "text-white" : "text-gray-600"}
                  `}
                >
                  {slot.displayTime}
                </Text>
              </View>

              {/* Timeline dot and line */}
              {index < 5 && (
                <View className="items-center h-[70px] mt-2">
                  <View
                    className={`
                      w-2 h-2 rounded-full
                      ${slot.hasActivity ? "bg-[#FCA251]" : "bg-gray-300"}
                    `}
                  />
                  <View className="w-0.5 h-full bg-gray-200 mt-1" />
                </View>
              )}
            </View>

            {/* Content on the right */}
            <View className="flex-1">
              {slot.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onEdit={onEditMeal} />
              ))}
            </View>
          </View>
        ))}

        {/* Dinner Section */}
        <View className="px-5 py-3">
          <Text className="text-xl font-PoppinsSemiBold text-gray-800 mb-2">
            Dinner
          </Text>
        </View>
        {timeSlots.slice(12).map((slot, index) => (
          <View key={slot.time} className="flex-row px-5 py-2">
            {/* Timeline on the left */}
            <View className="w-16 items-center mr-4">
              {/* Time label with orange pill background if active */}
              <View
                className={`
                  px-2 py-1 rounded-full min-w-[50px] items-center
                  ${slot.hasActivity ? "bg-[#FCA251]" : "bg-transparent"}
                `}
              >
                <Text
                  className={`
                    text-sm font-PoppinsMedium
                    ${slot.hasActivity ? "text-white" : "text-gray-600"}
                  `}
                >
                  {slot.displayTime}
                </Text>
              </View>

              {/* Timeline dot and line */}
              {index < 3 && (
                <View className="items-center h-[70px] mt-2">
                  <View
                    className={`
                      w-2 h-2 rounded-full
                      ${slot.hasActivity ? "bg-[#FCA251]" : "bg-gray-300"}
                    `}
                  />
                  <View className="w-0.5 h-full bg-gray-200 mt-1" />
                </View>
              )}
            </View>

            {/* Content on the right */}
            <View className="flex-1">
              {slot.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} onEdit={onEditMeal} />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default memo(MealTimeline);

// Export MealCard for potential standalone use
export { MealCard };
export type { MacroNutrients, MealEntry };
