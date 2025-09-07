import Ionicons from "@expo/vector-icons/build/Ionicons";
import React, { memo, useEffect } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

function TargetWeightSelection() {
  const {
    targetWeight,
    setTargetWeight,
    weightUnit: currentWeightUnit,
    weightGoal,
    weight: currentWeight,
  } = useOnboarding();

  // Automatically set targetWeight to currentWeight for maintain goal
  useEffect(() => {
    if (
      weightGoal === "maintain" &&
      currentWeight &&
      targetWeight !== currentWeight
    ) {
      setTargetWeight(currentWeight);
    }
  }, [weightGoal, currentWeight]);

  const getGoalMessage = () => {
    switch (weightGoal) {
      case "lose":
        return "What's your target weight for weight loss?";
      case "gain":
        return "What's your target weight for weight gain?";
      case "maintain":
        return "What weight would you like to maintain?";
      default:
        return "What's your target weight?";
    }
  };

  const getSubtitle = () => {
    const currentWeightNum = parseFloat(currentWeight);
    const targetWeightNum = parseFloat(targetWeight);

    if (
      !currentWeight ||
      !targetWeight ||
      isNaN(currentWeightNum) ||
      isNaN(targetWeightNum)
    ) {
      return "This helps us create a personalized plan for you.";
    }

    const difference = Math.abs(targetWeightNum - currentWeightNum);

    if (weightGoal === "lose" && targetWeightNum < currentWeightNum) {
      return `Goal: Lose ${difference.toFixed(1)} kg`;
    } else if (weightGoal === "gain" && targetWeightNum > currentWeightNum) {
      return `Goal: Gain ${difference.toFixed(1)} kg`;
    } else if (weightGoal === "maintain") {
      return `Goal: Maintain current weight`;
    } else {
      return "This helps us create a personalized plan for you.";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-2">
          Target Weight
        </Text>
        <Text className="text-sm font-Poppins text-foreground mb-8">
          {getSubtitle()}
        </Text>

        <View className="mt-6">
          <Text className="font-Poppins text-md text-foreground mb-4">
            {getGoalMessage()}
          </Text>

          {currentWeight && (
            <Text className="font-Poppins text-sm text-foreground mb-3">
              Current weight:{" "}
              <Text className="font-PoppinsSemiBold text-black">
                {currentWeight} kg
              </Text>
            </Text>
          )}

          <View className="flex-row items-center gap-2">
            <TextInputField
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              editable={weightGoal !== "maintain"}
              placeholderText="kg"
            />
            <TouchableOpacity className="bg-primary rounded-lg px-6 py-4 justify-center items-center max-w-[75px] min-w-[75px] flex-row gap-2">
              <Text className="font-PoppinsMedium font-sm text-white">kg</Text>
              <Ionicons name="swap-horizontal" size={12} color="white" />
            </TouchableOpacity>
          </View>

          {weightGoal === "lose" &&
            targetWeight &&
            currentWeight &&
            parseFloat(targetWeight) >= parseFloat(currentWeight) && (
              <Text className="text-red-500 text-sm font-Poppins mt-2">
                Target weight should be less than current weight for weight loss
              </Text>
            )}

          {weightGoal === "gain" &&
            targetWeight &&
            currentWeight &&
            parseFloat(targetWeight) <= parseFloat(currentWeight) && (
              <Text className="text-red-500 text-sm font-Poppins mt-2">
                Target weight should be more than current weight for weight gain
              </Text>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default memo(TargetWeightSelection);
