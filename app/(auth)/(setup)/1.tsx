import React, { memo } from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import TextInputField from "../../../components/TextInputField";
import { useOnboarding } from "./_layout";

function InputName() {
  console.log("InputName rendered");
  const { name, setName } = useOnboarding();

  return (
    <Animated.View className="flex-1 bg-white" entering={FadeIn.duration(500)}>
      <View className="flex-1 px-4 pt-4">
        <View className="mb-8">
          <Text className="text-3xl text-black font-PoppinsSemiBold">
            What is your name?
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-foreground text-sm font-Poppins">
              We'd like to get to know you.
            </Text>
          </View>
        </View>

        <View className="mt-2">
          <Text className="text-foreground text-sm  font-Poppins mb-2">
            Name
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={name}
              onChangeText={setName}
              maxLength={20}
              keyboardType="default"
            />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default memo(InputName);
