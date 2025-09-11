import React, { memo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useOnboarding } from "./_layout";

function DietTypeSelection() {
  const { dietType, setDietType } = useOnboarding();

  const dietTypes = [
    {
      id: "standard",
      title: "Standard Diet",
      description: "Balanced nutrition with all food groups",
      icon: "🥗",
    },
    {
      id: "mediterranean",
      title: "Mediterranean",
      description: "Diet rich in fruits, vegetables, fish, and olive oil",
      icon: "🫒",
    },
    {
      id: "low-carb",
      title: "Low-Carb",
      description: "Reduced carbohydrate intake for weight management",
      icon: "🥓",
    },
    {
      id: "intermittent-fasting",
      title: "Intermittent Fasting",
      description: "Time-restricted eating patterns",
      icon: "⏰",
    },
  ];

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-2">
          Choose Your Diet
        </Text>
        <Text className="text-sm font-Poppins text-foreground mb-6">
          Select the diet type that best matches your preferences and lifestyle.
        </Text>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <View className="space-y-3 gap-3">
            {dietTypes.map((diet) => (
              <TouchableOpacity
                key={diet.id}
                className={`p-4 rounded-lg border ${
                  dietType === diet.id
                    ? "bg-primary border-transparent"
                    : "bg-white border-border"
                }`}
                onPress={() => setDietType(diet.id)}
              >
                <View className="flex-row items-center">
                  <Text className="text-2xl mr-4">{diet.icon}</Text>
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-PoppinsSemiBold ${
                        dietType === diet.id ? "text-white" : "text-black"
                      }`}
                    >
                      {diet.title}
                    </Text>
                    <Text
                      className={`text-sm font-Poppins ${
                        dietType === diet.id ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      {diet.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Animated.View>
  );
}

export default memo(DietTypeSelection);
