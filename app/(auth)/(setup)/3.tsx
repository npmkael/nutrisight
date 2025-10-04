import React, { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Switch } from "../../../components/switch";

import {
  cmToFt,
  ftToCM,
  getRecommendedWeightRangeFeetAndInches,
  kgToLb,
  lbToKg,
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

type Unit = "ft/kg" | "cm/lb";

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

  const [unit, setUnit] = useState<Unit>("ft/kg");
  const [recommendation, setRecommendation] = useState<{
    desiredWeight: number;
    recommendation: string;
    desiredWeightInLessThan10Percent: number;
    desiredWeightInMoreThan10Percent: number;
  } | null>(null);
  const [converting, setConverting] = useState(false);
  const isOn = useSharedValue(false);

  useEffect(() => {
    // When switching to "cm/lb" we want height in cm and weight in lb.
    // When switching to "ft/kg" we want height in ft+in and weight in kg.
    setConverting(true);
    if (unit === "cm/lb") {
      setHeightUnit("cm");
      setWeightUnit("lb");
      // convert current ft/in -> cm
      const cm = ftToCM(heightFeet || "0", heightInches || "0");
      setHeightFeet(cm > 0 ? cm.toString() : "");
      setHeightInches("");
      // convert current kg -> lb
      const lb = kgToLb(weight || "0");
      setWeight(lb > 0 ? lb.toString() : "");
    } else {
      setHeightUnit("ft/in");
      setWeightUnit("kg");
      // convert current cm -> ft/in
      const { ft, inch } = cmToFt(heightFeet || "0");
      setHeightFeet(ft > 0 ? ft.toString() : "");
      setHeightInches(inch > 0 ? inch.toString() : "");
      // convert current lb -> kg
      const kg = lbToKg(weight || "0");
      setWeight(kg > 0 ? kg.toString() : "");
    }
    setTimeout(() => setConverting(false), 0);
  }, [unit]);

  useEffect(() => {
    if (converting) return;
    if (!heightFeet || !weight) {
      setRecommendation(null);
      return;
    }

    if (unit === "ft/kg") {
      const {
        desiredWeight,
        recommendation,
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      } = getRecommendedWeightRangeFeetAndInches(
        Number(heightFeet),
        Number(heightInches),
        Number(weight)
      );
      setRecommendation({
        desiredWeight,
        recommendation,
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      });
    } else {
      const { ft, inch } = cmToFt(heightFeet || "0");
      const kg = lbToKg(weight || "0");
      const {
        desiredWeight,
        recommendation,
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      } = getRecommendedWeightRangeFeetAndInches(ft, inch, kg);
      setRecommendation({
        desiredWeight,
        recommendation,
        desiredWeightInLessThan10Percent,
        desiredWeightInMoreThan10Percent,
      });
    }
  }, [heightFeet, heightInches, weight, unit, converting]);

  const handlePress = () => {
    setConverting(true);
    isOn.value = !isOn.value;
    setUnit(isOn.value ? "ft/kg" : "cm/lb");
  };

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-8">
          Height & Weight
        </Text>

        <View className="flex-row items-center justify-center gap-2 mt-2">
          <Text className="font-PoppinsMedium text-lg text-foreground">
            ft/kg
          </Text>
          <Switch value={isOn} onPress={handlePress} style={styles.switch} />
          <Text className="font-PoppinsMedium text-lg text-foreground">
            cm/lb
          </Text>
        </View>

        {/* Height Section */}
        <View className="mt-4 mb-3">
          <Text className="font-Poppins text-md text-foreground mb-1">
            Height
          </Text>
          <View className="flex-row items-center gap-2">
            {unit === "ft/kg" ? (
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
              placeholderText={unit === "ft/kg" ? "kg" : "lb"}
            />
          </View>
        </View>

        {/* Recommendation Card */}
        {recommendation && recommendation.recommendation !== "" && (
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
                  {recommendation?.recommendation === "underweight"
                    ? `Your weight is below the recommended range \n(${unit === "ft/kg" ? recommendation.desiredWeightInLessThan10Percent + " kg - " + recommendation.desiredWeightInMoreThan10Percent + " kg" : kgToLb(recommendation?.desiredWeightInLessThan10Percent.toString() || "0") + " lb - " + kgToLb(recommendation?.desiredWeightInMoreThan10Percent.toString() || "0") + " lb"}).`
                    : `Your weight is above the recommended range \n(${unit === "ft/kg" ? recommendation?.desiredWeightInLessThan10Percent + " kg - " + recommendation?.desiredWeightInMoreThan10Percent + " kg" : kgToLb(recommendation?.desiredWeightInLessThan10Percent.toString() || "0") + " lb - " + kgToLb(recommendation?.desiredWeightInMoreThan10Percent.toString() || "0") + " lb"}).`}
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
