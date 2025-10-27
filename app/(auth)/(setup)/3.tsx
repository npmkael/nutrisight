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
} from "react-native-reanimated";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

// Validation constants
const MIN_HEIGHT_FT = 4;
const MIN_HEIGHT_IN = 0;
const MAX_HEIGHT_FT = 7;
const MAX_HEIGHT_IN = 5;
const MIN_HEIGHT_CM = 122; // 4'0"
const MAX_HEIGHT_CM = 226; // 7'5"
const MIN_WEIGHT_KG = 20;
const MAX_WEIGHT_KG = 200;
const MIN_WEIGHT_LB = 44; // ~20 kg
const MAX_WEIGHT_LB = 440; // ~200 kg

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
    unit,
    setUnit,
    isOn,
  } = useOnboarding();
  const [recommendation, setRecommendation] = useState<{
    desiredWeight: number;
    recommendation: string;
    desiredWeightInLessThan10Percent: number;
    desiredWeightInMoreThan10Percent: number;
  } | null>(null);
  const [heightErrorMessage, setHeightErrorMessage] = useState<string>("");
  const [weightErrorMessage, setWeightErrorMessage] = useState<string>("");
  const [hasHeightError, setHasHeightError] = useState(false);
  const [hasWeightError, setHasWeightError] = useState(false);

  console.log("3.tsx rendered");
  console.log(heightFeet, heightInches, weight, unit);

  // Validation function
  const validateInputs = () => {
    let heightError = "";
    let weightError = "";

    // Validate height if it has a value
    if (heightFeet) {
      if (unit === "ft/kg") {
        const ft = Number(heightFeet);
        const inch = Number(heightInches) || 0;

        // Height validation
        const totalInches = ft * 12 + inch;
        const minInches = MIN_HEIGHT_FT * 12 + MIN_HEIGHT_IN;
        const maxInches = MAX_HEIGHT_FT * 12 + MAX_HEIGHT_IN;

        if (totalInches < minInches) {
          heightError = `Please enter an accurate height.`;
        } else if (totalInches > maxInches) {
          heightError = `Please enter an accurate height.`;
        }
      } else {
        const cm = Number(heightFeet);

        // Height validation
        if (cm < MIN_HEIGHT_CM) {
          heightError = `Please enter an accurate height.`;
        } else if (cm > MAX_HEIGHT_CM) {
          heightError = `Please enter an accurate height.`;
        }
      }
    }

    // Validate weight if it has a value
    if (weight) {
      if (unit === "ft/kg") {
        const wt = Number(weight);

        // Weight validation
        if (wt < MIN_WEIGHT_KG) {
          weightError = `Please enter an accurate weight.`;
        } else if (wt > MAX_WEIGHT_KG) {
          weightError = `Please enter an accurate weight.`;
        }
      } else {
        const lb = Number(weight);

        // Weight validation
        if (lb < MIN_WEIGHT_LB) {
          weightError = `Please enter an accurate weight.`;
        } else if (lb > MAX_WEIGHT_LB) {
          weightError = `Please enter an accurate weight.`;
        }
      }
    }

    setHasHeightError(!!heightError);
    setHasWeightError(!!weightError);
    setHeightErrorMessage(heightError);
    setWeightErrorMessage(weightError);
  };

  useEffect(() => {
    validateInputs();
    setRecommendation(null);
    if (heightErrorMessage || weightErrorMessage) return;

    if (heightFeet === "" || weight === "") {
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
  }, [
    heightFeet,
    heightInches,
    weight,
    unit,
    heightErrorMessage,
    weightErrorMessage,
  ]);

  const handlePress = () => {
    isOn.value = !isOn.value;

    if (unit === "ft/kg") {
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
            Height ({unit === "ft/kg" ? "ft/in" : "cm"})
          </Text>
          <View className="flex-row items-center gap-2">
            {unit === "ft/kg" ? (
              <>
                <TextInputField
                  value={heightFeet}
                  onChangeText={setHeightFeet}
                  maxLength={1}
                  keyboardType="numeric"
                  placeholderText="ft"
                  hasError={hasHeightError}
                />
                <TextInputField
                  value={heightInches}
                  onChangeText={setHeightInches}
                  maxLength={2}
                  keyboardType="numeric"
                  placeholderText="in"
                  hasError={hasHeightError}
                />
              </>
            ) : (
              <TextInputField
                value={heightFeet}
                onChangeText={setHeightFeet}
                maxLength={3}
                keyboardType="numeric"
                placeholderText="cm"
                hasError={hasHeightError}
              />
            )}
          </View>
          {heightErrorMessage && (
            <Text className="text-red-600 font-Poppins text-sm mt-1">
              {heightErrorMessage}
            </Text>
          )}
        </View>

        {/* Weight Section */}
        <View className="mt-4">
          <Text className="font-Poppins text-md text-foreground mb-1">
            Weight ({unit === "ft/kg" ? "kg" : "lb"})
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInputField
              value={weight}
              onChangeText={setWeight}
              maxLength={3}
              keyboardType="numeric"
              placeholderText={unit === "ft/kg" ? "kg" : "lb"}
              hasError={hasWeightError}
            />
          </View>
          {weightErrorMessage && (
            <Text className="text-red-600 font-Poppins text-sm mt-1">
              {weightErrorMessage}
            </Text>
          )}
        </View>

        {/* Information Card */}
        {/* <InfoCard
          title="Acceptable Ranges"
          content={`Height: ${unit === "ft/kg" ? `${MIN_HEIGHT_FT}'${MIN_HEIGHT_IN}" - ${MAX_HEIGHT_FT}'${MAX_HEIGHT_IN}"` : `${MIN_HEIGHT_CM} - ${MAX_HEIGHT_CM} cm`}\nWeight: ${unit === "ft/kg" ? `${MIN_WEIGHT_KG} - ${MAX_WEIGHT_KG} kg` : `${MIN_WEIGHT_LB} - ${MAX_WEIGHT_LB} lb`}`}
          className="mt-4"
        /> */}

        {/* Recommendation Card */}
        {recommendation &&
          recommendation.recommendation !== "" &&
          !heightErrorMessage &&
          !weightErrorMessage && (
            <Animated.View
              entering={FadeInDown.duration(500).springify()}
              exiting={FadeOutDown.duration(300)}
              className="mt-6 bg-white rounded-2xl p-5 border border-border"
            >
              {/* Card Content */}
              <View className="">
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
