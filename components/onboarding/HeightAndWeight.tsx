import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

import TextInputField from "../TextInputField";

interface HeightAndWeightProps {
  heightFeet: string;
  setHeightFeet: (height: string) => void;
  heightInches: string;
  setHeightInches: (height: string) => void;
  weight: string;
  setWeight: (weight: string) => void;
}

export default function HeightAndWeight({
  heightFeet,
  setHeightFeet,
  heightInches,
  setHeightInches,
  weight,
  setWeight,
}: HeightAndWeightProps) {
  const [heightUnit, setHeightUnit] = useState("ft/in");
  const [weightUnit, setWeightUnit] = useState("lb");
  const [isFocused, setIsFocused] = useState(false);

  const toggleHeightUnit = () => {
    setHeightUnit(heightUnit === "ft/in" ? "cm" : "ft/in");
  };

  const toggleWeightUnit = () => {
    setWeightUnit(weightUnit === "lb" ? "kg" : "lb");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-PoppinsSemiBold text-black">
          Just a few more questions
        </Text>

        {/* Height Section */}
        <View className="mt-6 mb-3">
          <Text className="font-Poppins text-md text-gray-500 mb-1">
            How tall are you?
          </Text>
          <View className="flex-row items-center gap-2">
            {heightUnit === "ft/in" ? (
              <>
                <TextInputField
                  value={heightFeet}
                  onChangeText={setHeightFeet}
                  maxLength={1}
                />
                <TextInputField
                  value={heightInches}
                  onChangeText={setHeightInches}
                  maxLength={2}
                />
              </>
            ) : (
              <TextInputField
                value={heightFeet}
                onChangeText={setHeightFeet}
                maxLength={3}
              />
            )}
            <TouchableOpacity
              className="bg-black rounded-lg px-6 py-4 justify-center items-center max-w-[75px] min-w-[75px]"
              onPress={toggleHeightUnit}
            >
              <Text className="font-PoppinsMedium font-sm text-white">
                {heightUnit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Weight Section */}
        <View className="mt-4">
          <Text className="font-Poppins text-md text-gray-500 mb-1">
            How much do you weigh?
          </Text>
          <View className="flex-row items-center gap-2">
            <TextInputField value={weight} onChangeText={setWeight} />
            <TouchableOpacity
              className="bg-black rounded-lg px-6 py-4 justify-center items-center max-w-[75px] min-w-[75px]"
              onPress={toggleWeightUnit}
            >
              <Text className="font-PoppinsMedium font-sm text-white">
                {weightUnit}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
