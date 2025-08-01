import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import TextInputField from "../TextInputField";

interface InputNameProps {
  value: string;
  onChangeText: (text: string) => void;
}

export default function InputName({ value, onChangeText }: InputNameProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4 pt-4">
        <View className="mb-8">
          <Text className="text-3xl text-black font-PoppinsSemiBold">
            First, what can we call you?
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-gray-400 text-sm font-Poppins">
              We'd like to get to know you.
            </Text>
          </View>
        </View>

        <View className="mt-2">
          <Text className="text-gray-500 text-sm  font-Poppins mb-2">
            Preferred first name
          </Text>
          <View className="flex-row items-center">
            <TextInputField
              value={value}
              onChangeText={onChangeText}
              maxLength={20}
              keyboardType="default"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
