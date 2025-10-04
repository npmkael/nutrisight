import {
  getRecommendedWeightRangeCm,
  getRecommendedWeightRangeFeetAndInches,
} from "@/lib/helpers";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

function SetTargetWeight() {
  const {
    targetWeight,
    setTargetWeight,
    weightGoal,
    weight: currentWeight,
    heightUnit,
    heightFeet,
    heightInches,
  } = useOnboarding();

  // Calculate recommended healthy weight based on height
  const recommendedWeight = useMemo(() => {
    if (!heightFeet) return null;

    if (heightUnit === "ft/in") {
      return Math.round(
        getRecommendedWeightRangeFeetAndInches(
          Number(heightFeet),
          Number(heightInches || 0)
        )
      );
    } else {
      return Math.round(getRecommendedWeightRangeCm(Number(heightFeet)));
    }
  }, [heightFeet, heightInches, heightUnit]);

  // Calculate suggested target weight based on goal
  const suggestedTargetWeight = useMemo(() => {
    const currentWeightNum = parseFloat(currentWeight);

    if (!weightGoal || !recommendedWeight || !currentWeight) {
      return null;
    }

    switch (weightGoal) {
      case "lose":
        if (currentWeightNum > recommendedWeight) {
          return recommendedWeight;
        } else {
          // Suggest 7.5% reduction (midpoint of 5-10%)
          return Math.round(currentWeightNum * 0.925);
        }

      case "gain":
        if (currentWeightNum < recommendedWeight) {
          return recommendedWeight;
        } else {
          // Suggest 7.5% increase (midpoint of 5-10%)
          return Math.round(currentWeightNum * 1.075);
        }

      case "maintain":
        return currentWeightNum;

      default:
        return recommendedWeight;
    }
  }, [weightGoal, currentWeight, recommendedWeight]);

  // Auto-fill target weight with recommendation when screen loads
  useEffect(() => {
    if (suggestedTargetWeight && !targetWeight) {
      setTargetWeight(suggestedTargetWeight.toString());
    }
  }, [suggestedTargetWeight]);

  // Get goal-specific recommendation message
  const getRecommendationMessage = () => {
    const currentWeightNum = parseFloat(currentWeight);

    if (!weightGoal || !recommendedWeight || !currentWeight) {
      return "Based on your profile, we'll help you track your progress toward your ideal weight.";
    }

    switch (weightGoal) {
      case "lose":
        if (currentWeightNum > recommendedWeight) {
          return `Based on your height and current weight, we recommend aiming for ${recommendedWeight} kg. This is a healthy weight range that supports your weight loss goal.`;
        } else {
          return `Your current weight is already in a healthy range. Consider setting a target that's 5-10% lower than your current weight (${Math.round(currentWeightNum * 0.9)}-${Math.round(currentWeightNum * 0.95)} kg) for gradual, sustainable weight loss.`;
        }

      case "gain":
        if (currentWeightNum < recommendedWeight) {
          return `Based on your height, we recommend targeting ${recommendedWeight} kg. This healthy weight supports your weight gain goal and overall wellness.`;
        } else {
          return `Consider setting a target that's 5-10% higher than your current weight (${Math.round(currentWeightNum * 1.05)}-${Math.round(currentWeightNum * 1.1)} kg) for gradual, healthy weight gain.`;
        }

      case "maintain":
        return `Great choice! Maintaining your current weight of ${currentWeight} kg will help you establish healthy habits. Your recommended healthy weight is ${recommendedWeight} kg.`;

      default:
        return "Based on your profile, we'll help you track your progress toward your ideal weight.";
    }
  };

  // Get icon and color based on goal
  const getGoalStyle = () => {
    switch (weightGoal) {
      case "lose":
        return {
          color: "#10B981",
          bgColor: "bg-green-50",
          textColor: "text-green-900",
          iconColor: "#10B981",
        };
      case "gain":
        return {
          color: "#F59E0B",
          bgColor: "bg-amber-50",
          textColor: "text-amber-900",
          iconColor: "#F59E0B",
        };
      case "maintain":
        return {
          color: "#3B82F6",
          bgColor: "bg-blue-50",
          textColor: "text-blue-900",
          iconColor: "#3B82F6",
        };
      default:
        return {
          color: "#3B82F6",
          bgColor: "bg-blue-50",
          textColor: "text-blue-900",
          iconColor: "#3B82F6",
        };
    }
  };

  const goalStyle = getGoalStyle();

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-8">
          Set Your Target Weight
        </Text>

        {/* Current Weight Display */}
        {currentWeight && (
          <View className="mb-4">
            <Text className="font-Poppins text-sm text-foreground">
              Current weight:{" "}
              <Text className="font-PoppinsSemiBold text-black">
                {currentWeight} kg
              </Text>
            </Text>
          </View>
        )}

        {/* Input Field */}
        <View className="mb-6">
          <Text className="font-Poppins text-md text-foreground mb-3">
            Target Weight (kg)
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInputField
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
              placeholderText="Enter target weight"
            />
          </View>
        </View>

        {/* Recommendation Info */}
        <Animated.View
          entering={FadeIn.duration(600).delay(600)}
          className={`${goalStyle.bgColor} p-4 rounded-2xl mb-8`}
        >
          <View className="flex-row items-center mb-2">
            <Ionicons
              name="information-circle"
              size={20}
              color={goalStyle.iconColor}
            />
            <Text
              className={`text-sm font-PoppinsSemiBold ${goalStyle.textColor} ml-2`}
            >
              Recommendation
            </Text>
          </View>
          <Text
            className={`text-sm font-Poppins ${goalStyle.textColor} leading-5`}
          >
            {getRecommendationMessage()}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

export default memo(SetTargetWeight);
