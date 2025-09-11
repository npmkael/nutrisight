import React, { memo, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useOnboarding } from "./_layout";

import { Armchair, PersonStanding } from "lucide-react-native";

function DailyActivitySelection() {
  const { activityLevel, setActivityLevel } = useOnboarding();

  const activityLevels = [
    {
      id: "sedentary",
      title: "Not Very Active",
      icon: <Armchair fill={"#000"} />,
      details: "Minimal physical activity throughout the day",
    },
    {
      id: "active",
      title: "Active",
      icon: <PersonStanding fill={"#000"} />,
      details: "Exercise 3-5 times per week, stay on your feet often",
    },
  ];

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-2">
          How active are you?
        </Text>
        <Text className="text-sm font-Poppins text-foreground mb-8">
          This helps us calculate your daily calorie needs more accurately.
        </Text>

        <View className="space-y-4 gap-4">
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.id}
              className={`p-6 rounded-xl border ${
                activityLevel === level.id
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => setActivityLevel(level.id)}
              style={{
                shadowColor: activityLevel === level.id ? "#2D3644" : "#000",
                shadowOffset: {
                  width: 0,
                  height: activityLevel === level.id ? 4 : 0,
                },
                shadowOpacity: activityLevel === level.id ? 0.15 : 0,
                shadowRadius: activityLevel === level.id ? 6 : 0,
                elevation: activityLevel === level.id ? 8 : 0,
              }}
            >
              <View className="items-center">
                {/* Icon Section */}
                <View
                  className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${
                    activityLevel === level.id
                      ? "bg-white bg-opacity-20"
                      : "bg-gray-100"
                  }`}
                >
                  {level.icon}
                </View>
                {/* Content Section */}
                <View className="items-center">
                  <Text
                    className={`text-xl font-PoppinsSemiBold mb-2 ${
                      activityLevel === level.id ? "text-white" : "text-black"
                    }`}
                  >
                    {level.title}
                  </Text>
                  <Text
                    className={`text-xs font-Poppins text-center ${
                      activityLevel === level.id
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {level.details}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

export default memo(DailyActivitySelection);
