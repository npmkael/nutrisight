import React, { memo, useEffect, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Switch } from "../../../components/switch";

import {
  convertFeetAndInchesToCm,
  getRecommendedWeightRangeCm,
  getRecommendedWeightRangeFeetAndInches,
} from "@/lib/helpers";
import { useState } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOutDown,
  useSharedValue,
} from "react-native-reanimated";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

type Unit = "Imperial" | "Metric";

function HeightAndWeight() {
  const {
    heightFeet,
    heightInches,
    weight,
    setHeightFeet,
    setHeightInches,
    setHeightUnit,
    setWeight,
    setWeightUnit,
  } = useOnboarding();

  const [unit, setUnit] = useState<Unit>("Imperial");
  const [showRecommendation, setShowRecommendation] = useState(true);
  const isOn = useSharedValue(false);

  useEffect(() => {
    if (unit === "Imperial") {
      setHeightUnit("ft/in");
      setWeightUnit("lb");
    } else {
      setHeightUnit("cm");
      setWeightUnit("kg");
    }

    console.log(convertFeetAndInchesToCm(5, 10));
  }, [unit]);

  // Calculate height in cm and weight in kg
  const heightInCm = useMemo(() => {
    if (!heightFeet) return null;

    if (unit === "Imperial") {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      return feet * 30.48 + inches * 2.54;
    } else {
      return parseFloat(heightFeet) || 0;
    }
  }, [heightFeet, heightInches, unit]);

  const weightInKg = useMemo(() => {
    if (!weight) return null;

    if (unit === "Imperial") {
      return (parseFloat(weight) || 0) * 0.453592;
    } else {
      return parseFloat(weight) || 0;
    }
  }, [weight, unit]);

  // Calculate recommended weight range based on healthy BMI (18.5 - 24.9)
  const recommendedWeightRange = useMemo(() => {
    if (!heightInCm || heightInCm === 0) return null;

    const heightInMeters = heightInCm / 100;
    const minWeight = 18.5 * heightInMeters * heightInMeters;
    const maxWeight = 24.9 * heightInMeters * heightInMeters;

    if (unit === "Imperial") {
      // Convert to pounds
      return {
        min: Math.round(minWeight * 2.20462),
        max: Math.round(maxWeight * 2.20462),
        unit: "lb",
      };
    } else {
      return {
        min: Math.round(minWeight),
        max: Math.round(maxWeight),
        unit: "kg",
      };
    }
  }, [heightInCm, unit]);

  const shouldShowRecommendation = useMemo(() => {
    return (
      showRecommendation &&
      heightFeet &&
      weight &&
      recommendedWeightRange !== null
    );
  }, [showRecommendation, heightFeet, weight, recommendedWeightRange]);

  const handlePress = () => {
    isOn.value = !isOn.value;
    setUnit(isOn.value ? "Imperial" : "Metric");
  };

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-8">
          Height & Weight
        </Text>

        <View className="flex-row items-center justify-center gap-2 mt-2">
          <Text className="font-PoppinsMedium text-lg text-foreground">
            Imperial
          </Text>
          <Switch value={isOn} onPress={handlePress} style={styles.switch} />
          <Text className="font-PoppinsMedium text-lg text-foreground">
            Metric
          </Text>
        </View>

        {/* Height Section */}
        <View className="mt-4 mb-3">
          <Text className="font-Poppins text-md text-foreground mb-1">
            Height
          </Text>
          <View className="flex-row items-center gap-2">
            {unit === "Imperial" ? (
              <>
                <TextInputField
                  value={heightFeet}
                  onChangeText={setHeightFeet}
                  maxLength={1}
                  placeholderText="ft"
                />
                <TextInputField
                  value={heightInches}
                  onChangeText={setHeightInches}
                  maxLength={2}
                  placeholderText="in"
                />
              </>
            ) : (
              <TextInputField
                value={heightFeet}
                onChangeText={setHeightFeet}
                maxLength={3}
                placeholderText="cm"
              />
            )}
          </View>
        </View>

        {/* Weight Section */}
        <View className="mt-4">
          <Text className="font-Poppins text-md text-foreground mb-1">
            Weight
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInputField
              value={weight}
              onChangeText={setWeight}
              placeholderText={unit === "Imperial" ? "kg" : "lb"}
            />
          </View>
        </View>

        {/* Recommendation Card */}
        {shouldShowRecommendation && recommendedWeightRange && (
          <Animated.View
            entering={FadeInDown.duration(500).springify()}
            exiting={FadeOutDown.duration(300)}
            className="mt-6 bg-white rounded-2xl p-5 border border-border"
          >
            {/* Card Content */}
            <View className="">
              <Text className="text-xl font-PoppinsSemiBold text-black mb-2">
                Recommended Weight Range
              </Text>
              <Text className="text-sm font-Poppins text-gray-600 mb-4 leading-5">
                Based on your height, here's your suggested range.
              </Text>
              <View className="bg-green-50 rounded-xl p-4 border border-green-200">
                <Text className="text-2xl font-PoppinsBold text-green-700 text-center">
                  {unit === "Imperial"
                    ? Math.round(
                        getRecommendedWeightRangeFeetAndInches(
                          Number(heightFeet),
                          Number(heightInches)
                        )
                      ) + " kg"
                    : Math.round(
                        getRecommendedWeightRangeCm(Number(heightFeet))
                      ) + " kg"}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  switch: {
    width: 75,
    height: 35,
    padding: 6,
  },
});

export default memo(HeightAndWeight);
