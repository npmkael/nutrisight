import React, { memo, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Switch } from "../../../components/switch";

import { useState } from "react";
import Animated, { FadeIn, useSharedValue } from "react-native-reanimated";
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
  const isOn = useSharedValue(false);

  useEffect(() => {
    if (unit === "Imperial") {
      setHeightUnit("ft/in");
      setWeightUnit("lb");
    } else {
      setHeightUnit("cm");
      setWeightUnit("kg");
    }
  }, [unit]);

  const handlePress = () => {
    isOn.value = !isOn.value;
    setUnit(isOn.value ? "Imperial" : "Metric");
  };

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(600)}>
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black mb-4">
          Your measurements
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
              placeholderText={unit === "Imperial" ? "lb" : "kg"}
            />
          </View>
        </View>
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
