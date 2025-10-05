import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface EmptySearchStateProps {
  message?: string;
  submessage?: string;
}

export function EmptySearchState({
  message = "No foods found",
  submessage = "Try a different search term or add manually",
}: EmptySearchStateProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="items-center justify-center py-16 px-6"
    >
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <MaterialCommunityIcons name="food-off" size={48} color="#9CA3AF" />
      </View>
      <Text
        className="text-gray-700 font-PoppinsSemiBold text-center mb-2"
        style={{ fontSize: 18 }}
      >
        {message}
      </Text>
      <Text
        className="text-gray-500 font-Poppins text-center"
        style={{ fontSize: 14 }}
      >
        {submessage}
      </Text>
    </Animated.View>
  );
}
