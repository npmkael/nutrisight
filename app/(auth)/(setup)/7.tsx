import weight from "@/app/(root)/(settings)/weight";
import {
  cmToFt,
  getRecommendedWeightRangeFeetAndInches,
  kgToLb,
  lbToKg,
} from "@/lib/helpers";
import React, { memo, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn, FadeInDown, FadeOutDown } from "react-native-reanimated";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

// Validation constants
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 200;
const MIN_WEIGHT_LB = 44; // ~20 kg
const MAX_WEIGHT_LB = 440; // ~200 kg

function SetTargetWeight() {
  const {
    targetWeight,
    setTargetWeight,
    weightGoal,
    weight: currentWeight,
    weightUnit,
    heightUnit,
    heightFeet,
    heightInches,
  } = useOnboarding();

  const [validationError, setValidationError] = useState<string>("");

  console.log(weightUnit);

  // Calculate recommended healthy weight based on height
  const recommendedWeightRange = useMemo(() => {
    if (!heightFeet) return null;

    if (heightUnit === "ft/in") {
      const {
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      } = getRecommendedWeightRangeFeetAndInches(
        Number(heightFeet),
        Number(heightInches || 0),
        Number(currentWeight || 0)
      );

      return {
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      };
    } else {
      const { ft, inch } = cmToFt(heightFeet || "0");
      const kg = lbToKg(weight.toString() || "0");
      const {
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      } = getRecommendedWeightRangeFeetAndInches(ft, inch, kg);

      return {
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      };
    }
  }, [heightFeet, heightInches, heightUnit]);

  console.log(recommendedWeightRange)

  // Calculate suggested target weight based on goal
  const suggestedTargetWeight = useMemo(() => {
    const currentWeightNum = parseFloat(currentWeight);

    if (!weightGoal || !recommendedWeightRange || !currentWeight) {
      return null;
    }

    switch (weightGoal) {
      case "lose":
        if (
          currentWeightNum >
          recommendedWeightRange.desiredWeightInMoreThan10Percent
        ) {
          return recommendedWeightRange.desiredWeightInMoreThan10Percent;
        } else {
          // Suggest 7.5% reduction (midpoint of 5-10%)
          return Math.round(currentWeightNum * 0.925);
        }

      case "gain":
        if (
          currentWeightNum <
          recommendedWeightRange.desiredWeightInLessThan10Percent
        ) {
          return recommendedWeightRange.desiredWeightInLessThan10Percent;
        } else {
          // Suggest 7.5% increase (midpoint of 5-10%)
          return Math.round(currentWeightNum * 1.075);
        }

      case "maintain":
        return currentWeightNum;

      default:
        return recommendedWeightRange;
    }
  }, [weightGoal, currentWeight, recommendedWeightRange]);

  // Auto-fill target weight with recommendation when screen loads
  useEffect(() => {
    if (suggestedTargetWeight) {
      setTargetWeight(suggestedTargetWeight.toString());
    }
  }, [suggestedTargetWeight]);

  // Validate target weight
  useEffect(() => {
    if (!targetWeight || targetWeight.trim() === "") {
      setValidationError("");
      return;
    }

    const targetWt = Number(targetWeight);
    
    if (isNaN(targetWt)) {
      setValidationError("");
      return;
    }

    const errors: string[] = [];

    if (weightUnit === "kg") {
      if (targetWt < MIN_WEIGHT_KG) {
        errors.push("Please enter an accurate weight");
      } else if (targetWt > MAX_WEIGHT_KG) {
        errors.push("Please enter an accurate weight");
      }
    } else {
      if (targetWt < MIN_WEIGHT_LB) {
        errors.push("Please enter an accurate weight");
      } else if (targetWt > MAX_WEIGHT_LB) {
        errors.push("Please enter an accurate weight");
      }
    }

    setValidationError(errors.join("\n"));
  }, [targetWeight, weightUnit]);

  // Get goal-specific recommendation message
  const getRecommendationMessage = () => {
    const currentWeightNum = parseFloat(currentWeight);

    if (!weightGoal || !recommendedWeightRange || !currentWeight) {
      return "Based on your profile, we'll help you track your progress toward your ideal weight.";
    }

    switch (weightGoal) {
      case "lose":
        if (
          currentWeightNum >
          recommendedWeightRange.desiredWeightInMoreThan10Percent
        ) {
          const left =
            weightUnit === "kg"
              ? `${recommendedWeightRange.desiredWeightInLessThan10Percent}kg`
              : `${Math.round(
                  kgToLb(
                    recommendedWeightRange.desiredWeightInLessThan10Percent.toString()
                  )
                )}lb`;
          const right =
            weightUnit === "kg"
              ? `${recommendedWeightRange.desiredWeightInMoreThan10Percent}kg`
              : `${Math.round(
                  kgToLb(
                    recommendedWeightRange.desiredWeightInMoreThan10Percent.toString()
                  )
                )}lb`;

          return `Based on your height and current weight, we recommend aiming for ${left} - ${right}. This is a healthy weight range that supports your weight loss goal.`;
        } else {
          return `Your current weight is already in a healthy range. Consider setting a target that's 5-10% lower than your current weight (${Math.round(
            currentWeightNum * 0.9
          )}-${Math.round(currentWeightNum * 0.95)} kg) for gradual, sustainable weight loss.`;
        }

      case "gain":
        if (
          currentWeightNum <
          recommendedWeightRange.desiredWeightInLessThan10Percent
        ) {
          const left =
            weightUnit === "kg"
              ? `${recommendedWeightRange.desiredWeightInLessThan10Percent}kg`
              : `${Math.round(
                  kgToLb(
                    recommendedWeightRange.desiredWeightInLessThan10Percent.toString()
                  )
                )}lb`;

          const right =
            weightUnit === "kg"
              ? `${recommendedWeightRange.desiredWeightInMoreThan10Percent}kg`
              : `${Math.round(
                  kgToLb(
                    recommendedWeightRange.desiredWeightInMoreThan10Percent.toString()
                  )
                )}lb`;

          return `Based on your height, we recommend targeting ${left} - ${right}. This healthy weight supports your weight gain goal and overall wellness.`;
        } else {
          const low = Math.round(currentWeightNum * 1.05);
          const high = Math.round(currentWeightNum * 1.1);
          const unitSuffix = weightUnit === "kg" ? "kg" : "lb";
          return `Consider setting a target that's 5-10% higher than your current weight (${low}-${high}${unitSuffix}) for gradual, healthy weight gain.`;
        }

      case "maintain":
        const left = 
          weightUnit === "kg"
          ? `${recommendedWeightRange.desiredWeightInLessThan10Percent}kg`
          : `${Math.round(
              kgToLb(
                recommendedWeightRange.desiredWeightInLessThan10Percent.toString()
              )
            )}lb`;

          const right =
            weightUnit === "kg"
              ? `${recommendedWeightRange.desiredWeightInMoreThan10Percent}kg`
              : `${Math.round(
                  kgToLb(
                    recommendedWeightRange.desiredWeightInMoreThan10Percent.toString()
                  )
                )}lb`;

        return `Great choice! Maintaining your current weight of ${currentWeight}${weightUnit} will help you establish healthy habits. Your recommended healthy weight is ${left} - ${right}.`;

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
                {weightUnit === "kg"
                  ? `${currentWeight}kg`
                  : `${currentWeight}lb`}
              </Text>
            </Text>
          </View>
        )}

        {/* Input Field */}
        <View className="mb-6">
          <Text className="font-Poppins text-md text-foreground mb-3">
            Target Weight ({weightUnit})
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

        {/* Validation Error */}
        {validationError && (
          <Animated.View
            entering={FadeInDown.duration(300)}
            exiting={FadeOutDown.duration(200)}
            className="mb-4 bg-red-50 rounded-xl p-4 border border-red-200"
          >
            <Text className="text-red-700 font-PoppinsMedium text-center">
              {validationError}
            </Text>
          </Animated.View>
        )}

        {/* Recommendation Info */}
        {/* <Animated.View
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
        </Animated.View> */}
      </View>
    </Animated.View>
  );
}

export default memo(SetTargetWeight);
