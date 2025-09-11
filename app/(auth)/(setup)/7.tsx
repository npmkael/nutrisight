import React, { memo, useEffect } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
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
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-2">
          Target Weight
        </Text>
        <Text className="text-sm font-Poppins text-foreground mb-8">
          {getSubtitle()}
        </Text>

        <View className="mt-6">
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
    </Animated.View>
  );
}

export default memo(TargetWeightSelection);
