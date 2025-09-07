import React, { memo } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { useOnboarding } from "./_layout";

function WeightGoalSelection() {
  const { weightGoal, setWeightGoal } = useOnboarding();

  const goals = [
    {
      id: "lose",
      title: "Lose Weight",
      description: "Reduce body weight through caloric deficit",
      icon: "📉",
    },
    {
      id: "maintain",
      title: "Maintain Weight",
      description: "Keep current weight stable",
      icon: "⚖️",
    },
    {
      id: "gain",
      title: "Gain Weight",
      description: "Increase body weight through caloric surplus",
      icon: "📈",
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-2">
          What's your goal?
        </Text>
        <Text className="text-s, font-Poppins text-foreground mb-8">
          This helps us personalize your nutrition recommendations
        </Text>

        <View className="space-y-4 gap-2">
          {goals.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              className={`p-4 rounded-lg border ${
                weightGoal === goal.id
                  ? "bg-primary border-transparent"
                  : "bg-white border-gray-200"
              }`}
              onPress={() => setWeightGoal(goal.id)}
            >
              <View className="flex-row items-center">
                <Text className="text-2xl mr-4">{goal.icon}</Text>
                <View className="flex-1">
                  <Text
                    className={`text-lg font-PoppinsSemiBold ${
                      weightGoal === goal.id ? "text-white" : "text-black"
                    }`}
                  >
                    {goal.title}
                  </Text>
                  <Text
                    className={`text-sm font-Poppins ${
                      weightGoal === goal.id ? "text-gray-200" : "text-gray-500"
                    }`}
                  >
                    {goal.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default memo(WeightGoalSelection);
